# backend/app.py (Complete Production-Ready Version with Perfect Error Handling)
from flask import Flask, request, jsonify
import joblib
import os
import sys
import logging
import numpy as np
import pandas as pd
from flask_cors import CORS
from datetime import datetime
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.tree import DecisionTreeRegressor
import xgboost as xgb
from dotenv import load_dotenv
import json
import re
import traceback

# Load environment variables
load_dotenv()

# Agent imports with Groq
try:
    from langchain.agents import create_react_agent, AgentExecutor
    from langchain.tools import Tool
    from langchain_groq import ChatGroq
    from langchain.prompts import PromptTemplate
    from langchain.memory import ConversationBufferMemory
    from langchain import hub
    AGENT_AVAILABLE = True
except ImportError as e:
    AGENT_AVAILABLE = False
    logging.warning(f"Agent dependencies not available: {e}")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Flexible data loading with multiple path attempts
base_dir = os.path.dirname(os.path.abspath(__file__))

# Try multiple possible paths for the CSV file
possible_csv_paths = [
    os.path.join(base_dir, 'public', 'sealevel.csv'),
    os.path.join(base_dir, 'sealevel.csv'),
    os.path.join(base_dir, '..', 'public', 'sealevel.csv'),
    os.path.join(base_dir, 'data', 'sealevel.csv'),
    os.path.join(base_dir, '..', 'data', 'sealevel.csv'),
    os.path.join(base_dir, '..', 'sealevel.csv')
]

sea_level_data = None
for csv_path in possible_csv_paths:
    try:
        if os.path.exists(csv_path):
            logger.info(f"Found and loading sea level data from: {csv_path}")
            sea_level_data = pd.read_csv(csv_path)
            break
    except Exception as e:
        logger.warning(f"Failed to load from {csv_path}: {str(e)}")
        continue

if sea_level_data is not None:
    try:
        sea_level_df = sea_level_data[['Year', 'GMSL_GIA']].copy()
        annual_data = sea_level_df.groupby('Year').mean().reset_index()
        baseline = annual_data[annual_data['Year'] == 1993]['GMSL_GIA'].values[0]
        annual_data['SeaLevelRise'] = annual_data['GMSL_GIA'] - baseline
        logger.info("Sea level data loaded and processed successfully")
    except Exception as e:
        logger.error(f"Failed to process sea level data: {str(e)}")
        # Use dummy data if processing fails
        years = list(range(1993, 2022))
        sea_level_rise = [i * 3.2 for i in range(len(years))]
        annual_data = pd.DataFrame({'Year': years, 'SeaLevelRise': sea_level_rise})
        logger.warning("Using dummy sea level data")
else:
    logger.warning("No sea level CSV file found in any location, using dummy data")
    years = list(range(1993, 2022))
    sea_level_rise = [i * 3.2 for i in range(len(years))]
    annual_data = pd.DataFrame({'Year': years, 'SeaLevelRise': sea_level_rise})

# Sea regions data
sea_regions = {
    'Arabian Sea': {
        'multiplier': 1.0,
        'variability': 0.15,
        'acceleration': 1.05,
        'description': 'Moderate sea level rise with seasonal variations due to monsoons'
    },
    'Caribbean Sea': {
        'multiplier': 0.85,
        'variability': 0.2,
        'acceleration': 1.0,
        'description': 'Lower than global average due to ocean circulation patterns'
    },
    'Philippine Sea': {
        'multiplier': 2.05,
        'variability': 0.25,
        'acceleration': 1.1,
        'description': 'Highest risk area due to thermal expansion and regional warming'
    },
    'Coral Sea': {
        'multiplier': 1.1,
        'variability': 0.18,
        'acceleration': 1.08,
        'description': 'Moderate to high risk with coral reef ecosystem impacts'
    },
    'Labrador Sea': {
        'multiplier': 0.85,
        'variability': 0.3,
        'acceleration': 0.95,
        'description': 'Lower rise due to glacial isostatic adjustment'
    },
    'Barents Sea': {
        'multiplier': 1.2,
        'variability': 0.35,
        'acceleration': 1.15,
        'description': 'Arctic warming effects with high seasonal variability'
    }
}

def train_models():
    X = annual_data[['Year']].values
    y = annual_data['SeaLevelRise'].values
    
    lr_model = LinearRegression()
    lr_model.fit(X, y)
    
    dt_model = DecisionTreeRegressor(max_depth=5, random_state=42)
    dt_model.fit(X, y)
    
    rf_model = RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
    rf_model.fit(X, y)
    
    xgb_model = xgb.XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42)
    xgb_model.fit(X, y)
    
    return {
        'linear': lr_model,
        'decision_tree': dt_model,
        'random_forest': rf_model,
        'xgboost': xgb_model
    }

def predict(sea_name, future_year):
    current_year = 2025
    sea_params = sea_regions.get(sea_name, {
        'multiplier': 1.0,
        'variability': 0.2,
        'acceleration': 1.0
    })
    
    years = np.array([[year] for year in range(current_year - 10, future_year + 1)])
    predictions = {}
    
    for model_name, model in models.items():
        try:
            raw_predictions = model.predict(years)
            adjusted_predictions = []
            
            for i, year in enumerate(range(current_year - 10, future_year + 1)):
                pred = raw_predictions[i]
                pred = pred * sea_params['multiplier']
                
                years_from_present = year - current_year
                if years_from_present > 0:
                    acceleration_effect = (years_from_present / 10) * (sea_params['acceleration'] - 1.0)
                    pred = pred * (1.0 + acceleration_effect)
                
                if model_name == 'linear':
                    variability = np.sin(i * 0.4) * sea_params['variability'] * 5 
                elif model_name == 'decision_tree':
                    variability = (i % 3 - 1) * sea_params['variability'] * 8
                elif model_name == 'random_forest':
                    variability = (np.sin(i * 0.5) + np.cos(i * 0.3)) * sea_params['variability'] * 6
                else:
                    variability = np.sin(i * 0.6) * np.cos(i * 0.2) * sea_params['variability'] * 7
                
                pred = pred + variability
                adjusted_predictions.append(float(pred))
            
            predictions[model_name] = adjusted_predictions
            
        except Exception as e:
            predictions[model_name] = [f"Error: {str(e)}"]
            logger.error(f"Prediction error for {model_name}: {str(e)}")
    
    predictions['years'] = list(range(current_year - 10, future_year + 1))
    return predictions

# Train models
try:
    models = train_models()
    logger.info("Models trained successfully")
except Exception as e:
    logger.error(f"Failed to train models: {str(e)}")
    raise

# Production-Ready Risk Assessment Class
class BasicRiskEnhancer:
    def __init__(self, sea_regions):
        self.sea_regions = sea_regions
    
    def enhance_response(self, technical_response, user_query):
        """Transform technical agent responses into human-friendly risk assessments"""
        try:
            logger.info(f"=== RISK ENHANCEMENT DEBUG ===")
            logger.info(f"User query: {user_query}")
            logger.info(f"Technical response: {technical_response[:200]}...")
            
            # PRODUCTION: Comprehensive error detection
            error_indicators = [
                "error", "not available", "can't provide", "unable to", 
                "please specify", "not found", "failed", "unavailable",
                "stopped due to iteration limit", "time limit", "only offers predictions",
                "encountered an error", "try rephrasing", "don't recognize",
                "invalid year", "available seas are", "i don't recognize"
            ]
            
            has_error = any(indicator in technical_response.lower() for indicator in error_indicators)
            logger.info(f"Has error indicators: {has_error}")
            
            if has_error:
                logger.info("Skipping risk enhancement due to error in technical response")
                return technical_response
            
            # Extract sea name from query or response
            sea_name = self.extract_sea_name(user_query, technical_response)
            logger.info(f"Extracted sea name: {sea_name}")
            
            if not sea_name:
                logger.info("No valid sea name found, returning original response")
                return technical_response
            
            # Check if response contains actual prediction data
            has_prediction_data = self.contains_prediction_data(technical_response)
            logger.info(f"Contains prediction data: {has_prediction_data}")
            
            if not has_prediction_data:
                logger.info("No prediction data found, returning original response")
                return technical_response
            
            logger.info("=== APPLYING RISK ENHANCEMENT ===")
            
            # Get risk intelligence
            risk_intel = self.generate_risk_intelligence(sea_name, technical_response)
            logger.info(f"Generated risk intelligence for {sea_name}")
            
            # Create enhanced response
            enhanced_response = f"""{technical_response}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 RISK ASSESSMENT
{risk_intel['risk_level']} - {risk_intel['visual_analogy']}

👥 HUMAN IMPACT
{risk_intel['human_impact']}

⚡ RECOMMENDED ACTION
{risk_intel['actionable_step']}

🌊 EXPERT INSIGHT
{risk_intel['narrative_flair']}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"""
            
            logger.info("=== RISK ENHANCEMENT COMPLETE ===")
            return enhanced_response.strip()
            
        except Exception as e:
            logger.warning(f"Risk enhancement failed: {str(e)}")
            logger.error(f"Enhancement error traceback: {traceback.format_exc()}")
            return technical_response
    
    def contains_prediction_data(self, response):
        """Production-grade prediction data detection"""
        prediction_indicators = [
            "prediction", "mm", "rise", "level", "sea level", 
            "high risk", "medium risk", "low risk", "critical risk",
            "average", "analysis", "projected", "by 20",
            "philippine sea", "barents sea", "arabian sea", "caribbean sea",
            "coral sea", "labrador sea"
        ]
        
        found_indicators = [indicator for indicator in prediction_indicators if indicator in response.lower()]
        logger.info(f"Found prediction indicators: {found_indicators}")
        
        return len(found_indicators) > 0
    
    def extract_sea_name(self, user_query, response):
        """Production-grade sea name extraction"""
        # Check user query first (most reliable)
        for sea in self.sea_regions.keys():
            if sea.lower() in user_query.lower():
                logger.info(f"Found sea in query: {sea}")
                return sea
        
        # Check response text as backup
        for sea in self.sea_regions.keys():
            if sea.lower() in response.lower():
                logger.info(f"Found sea in response: {sea}")
                return sea
        
        # Partial matches for robustness
        for sea in self.sea_regions.keys():
            sea_words = sea.lower().split()
            if any(word in response.lower() for word in sea_words if len(word) > 3):
                logger.info(f"Found sea by partial match: {sea}")
                return sea
        
        logger.warning(f"No sea found in query: '{user_query}' or response: '{response[:100]}...'")
        return None
    
    def generate_risk_intelligence(self, sea_name, technical_response):
        """Generate comprehensive risk intelligence"""
        sea_params = self.sea_regions.get(sea_name, {})
        multiplier = sea_params.get('multiplier', 1.0)
        prediction_mm = self.extract_prediction_value(technical_response)
        
        logger.info(f"Sea params for {sea_name}: multiplier={multiplier}, prediction_mm={prediction_mm}")
        
        return {
            'risk_level': self.classify_risk_level(multiplier),
            'visual_analogy': self.create_visual_analogy(prediction_mm),
            'human_impact': self.estimate_human_impact(sea_name, multiplier, prediction_mm),
            'actionable_step': self.suggest_action(sea_name, multiplier),
            'narrative_flair': self.add_sentinel_narrative(sea_name, multiplier)
        }
    
    def extract_prediction_value(self, response):
        """Production-grade prediction value extraction"""
        # Look for numbers followed by 'mm'
        matches = re.findall(r'(\d+\.?\d*)\s*mm', response)
        if matches:
            prediction = float(matches[0])
            logger.info(f"Extracted prediction value: {prediction}mm")
            return prediction
        
        # Look for "is X.XX mm" pattern
        is_matches = re.findall(r'is\s+(\d+\.?\d*)\s*mm', response)
        if is_matches:
            prediction = float(is_matches[0])
            logger.info(f"Extracted prediction from 'is' pattern: {prediction}mm")
            return prediction
        
        # Look for reasonable prediction numbers
        number_matches = re.findall(r'(\d+\.?\d+)', response)
        for match in number_matches:
            num = float(match)
            if 50 <= num <= 1000:
                logger.info(f"Using reasonable number as prediction: {num}mm")
                return num
        
        logger.warning("No prediction value found, using default 100mm")
        return 100
    
    def classify_risk_level(self, multiplier):
        """Classify risk level with human-friendly terms"""
        if multiplier > 1.5:
            return "🔴 CRITICAL RISK"
        elif multiplier > 1.2:
            return "🟠 HIGH RISK"
        elif multiplier > 0.9:
            return "🟡 MODERATE RISK"
        else:
            return "🟢 LOWER RISK"
    
    def create_visual_analogy(self, prediction_mm):
        """Create relatable visual analogies"""
        if prediction_mm < 50:
            return f"Water rising about {int(prediction_mm/25)} stacked smartphones ({prediction_mm:.1f}mm)"
        elif prediction_mm < 150:
            return f"Sea level climbing roughly the height of a coffee mug ({prediction_mm:.1f}mm)"
        elif prediction_mm < 300:
            return f"Water rising about the height of a dining table leg ({prediction_mm:.1f}mm)"
        elif prediction_mm < 600:
            return f"Sea level climbing as tall as a kitchen counter ({prediction_mm:.1f}mm)"
        else:
            return f"Water rising higher than most doorways ({prediction_mm:.1f}mm)"
    
    def estimate_human_impact(self, sea_name, multiplier, prediction_mm):
        """Estimate human and infrastructure impact"""
        population_estimates = {
            'Philippine Sea': 15000000,
            'Arabian Sea': 8000000,
            'Caribbean Sea': 5000000,
            'Coral Sea': 2000000,
            'Barents Sea': 500000,
            'Labrador Sea': 300000
        }
        
        base_population = population_estimates.get(sea_name, 3000000)
        
        if multiplier > 1.5:
            affected_ratio = 0.25
            infrastructure_risk = "Major ports, airports, and hospitals"
        elif multiplier > 1.2:
            affected_ratio = 0.15
            infrastructure_risk = "Coastal roads, harbors, and schools"
        elif multiplier > 0.9:
            affected_ratio = 0.08
            infrastructure_risk = "Low-lying infrastructure and beaches"
        else:
            affected_ratio = 0.03
            infrastructure_risk = "Some vulnerable coastal areas"
        
        affected_people = int(base_population * affected_ratio)
        
        return f"Around {affected_people:,} people and {infrastructure_risk} could face regular flooding impacts"
    
    def suggest_action(self, sea_name, multiplier):
        """Provide actionable next steps"""
        if multiplier > 1.5:
            return "🚨 Begin immediate adaptation planning - consider sea walls, building elevation, or managed retreat options by 2028"
        elif multiplier > 1.2:
            return "📋 Start developing 10-year coastal adaptation plan - assess critical infrastructure and flood defenses"
        elif multiplier > 0.9:
            return "📊 Implement monitoring systems and update emergency protocols - prepare for gradual changes over 15-20 years"
        else:
            return "🔍 Establish baseline monitoring and review coastal development policies for long-term resilience"
    
    def add_sentinel_narrative(self, sea_name, multiplier):
        """Add compelling storytelling flair"""
        if multiplier > 1.5:
            return f"The {sea_name} is entering a critical acceleration phase—like watching a slow-motion avalanche that's picking up speed. The window for adaptation is narrowing."
        elif multiplier > 1.2:
            return f"The {sea_name} shows an accelerating pulse—rising faster than the global rhythm. Early action now can still bend this curve."
        elif multiplier > 0.9:
            return f"The {sea_name} follows the global heartbeat of rising seas—steady and persistent like ocean tides that never stop."
        else:
            return f"The {sea_name} rises more gently than global trends—nature's variation provides a buffer, but vigilance remains essential."

# Production-Ready SeaLevelAgent Class
class SeaLevelAgent:
    def __init__(self, models, sea_regions, annual_data):
        if not AGENT_AVAILABLE:
            raise Exception("Agent dependencies not available")
            
        self.models = models
        self.sea_regions = sea_regions
        self.annual_data = annual_data
        self.memory = ConversationBufferMemory(return_messages=True)
        
        # Context tracking for "same sea" references
        self.conversation_context = {
            'last_sea': None,
            'last_year': None,
            'query_history': []
        }
        
        # Initialize the risk enhancer
        self.risk_enhancer = BasicRiskEnhancer(sea_regions)
        
        # Initialize Groq LLM
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise Exception("Groq API key not found in environment variables")
            
        self.llm = ChatGroq(
            temperature=0.5,
            # model_name="gemma2-9b-it",
            model_name="openai/gpt-oss-120b",
            groq_api_key=api_key,
            max_tokens=1024
        )
        
        self.tools = self._create_tools()
        self.agent_executor = self._create_agent()
    
    def _create_tools(self):
        def analyze_sea_level_prediction(query: str) -> str:
            """PRODUCTION: Analyze sea level predictions with perfect validation"""
            try:
                logger.info(f"Tool processing: {query}")
                words = query.lower().split()
                sea_name = None
                year = None
                
                # Check for specific sea names
                for sea in self.sea_regions.keys():
                    if sea.lower() in query.lower():
                        sea_name = sea
                        break
                
                # Handle context references
                if not sea_name:
                    context_words = ['same', 'that', 'this', 'it', 'there']
                    if any(word in query.lower() for word in context_words):
                        if self.conversation_context['last_sea']:
                            sea_name = self.conversation_context['last_sea']
                            logger.info(f"Using context sea: {sea_name}")
                
                # PRODUCTION: Strict year validation
                for word in words:
                    if word.isdigit() and len(word) == 4:
                        potential_year = int(word)
                        if 2020 <= potential_year <= 2100:
                            year = potential_year
                            break
                        else:
                            return f"Invalid year {potential_year}. Please specify a year between 2020 and 2100."
                
                # PRODUCTION: Clear error messages
                if not sea_name:
                    available_seas = ", ".join(self.sea_regions.keys())
                    return f"I don't recognize that sea name. Available seas are: {available_seas}. Please try one of these."
                
                if not year:
                    return f"Please specify a year between 2020 and 2100 for the {sea_name} prediction."
                
                # Store context for future queries
                self.conversation_context['last_sea'] = sea_name
                self.conversation_context['last_year'] = year
                self.conversation_context['query_history'].append(f"{sea_name} {year}")
                logger.info(f"Stored context: sea={sea_name}, year={year}")
                
                predictions = predict(sea_name, year)
                sea_info = self.sea_regions[sea_name]
                
                latest_predictions = {
                    model: preds[-1] for model, preds in predictions.items() 
                    if model != 'years' and isinstance(preds, list)
                }
                
                avg_prediction = np.mean(list(latest_predictions.values()))
                
                analysis = {
                    'sea': sea_name,
                    'target_year': year,
                    'average_prediction_mm': round(avg_prediction, 2),
                    'risk_level': 'High' if sea_info['multiplier'] > 1.2 else 'Medium' if sea_info['multiplier'] > 0.9 else 'Low',
                    'description': sea_info.get('description', 'No description available'),
                    'model_predictions': {k: round(v, 2) for k, v in latest_predictions.items()}
                }
                
                return json.dumps(analysis, indent=2)
                
            except Exception as e:
                return f"Error analyzing prediction: {str(e)}"
        
        def compare_seas(query: str) -> str:
            """Compare sea level rise between different seas"""
            try:
                mentioned_seas = []
                for sea in self.sea_regions.keys():
                    if sea.lower() in query.lower():
                        mentioned_seas.append(sea)
                
                if len(mentioned_seas) < 2:
                    available_seas = ", ".join(self.sea_regions.keys())
                    return f"Please mention at least two seas for comparison. Available seas: {available_seas}"
                
                comparison = {}
                for sea in mentioned_seas[:4]:
                    params = self.sea_regions[sea]
                    
                    sample_pred = predict(sea, 2030)
                    avg_2030 = np.mean([pred[-6] for pred in sample_pred.values() if isinstance(pred, list)])
                    
                    comparison[sea] = {
                        'risk_multiplier': params['multiplier'],
                        'risk_level': 'High' if params['multiplier'] > 1.2 else 'Medium' if params['multiplier'] > 0.9 else 'Low',
                        'predicted_rise_2030_mm': round(avg_2030, 2),
                        'variability': params['variability'],
                        'description': params.get('description', '')
                    }
                
                return json.dumps(comparison, indent=2)
                
            except Exception as e:
                return f"Error comparing seas: {str(e)}"
        
        def get_sea_info(sea_name: str) -> str:
            """Get detailed information about a specific sea"""
            try:
                target_sea = None
                for sea in self.sea_regions.keys():
                    if sea.lower() in sea_name.lower():
                        target_sea = sea
                        break
                
                if not target_sea:
                    available_seas = ", ".join(self.sea_regions.keys())
                    return f"Sea not found. Available seas: {available_seas}"
                
                info = self.sea_regions[target_sea]
                
                sample_predictions = predict(target_sea, 2050)
                current_level = sample_predictions['linear'][10]
                future_level = sample_predictions['linear'][-1]
                
                sea_details = {
                    'name': target_sea,
                    'risk_multiplier': info['multiplier'],
                    'risk_level': 'High' if info['multiplier'] > 1.2 else 'Medium' if info['multiplier'] > 0.9 else 'Low',
                    'description': info.get('description', ''),
                    'variability_factor': info['variability'],
                    'acceleration_factor': info['acceleration'],
                    'current_trend_mm': round(current_level, 2),
                    'projected_2050_mm': round(future_level, 2),
                    'total_rise_by_2050': round(future_level - current_level, 2)
                }
                
                return json.dumps(sea_details, indent=2)
                
            except Exception as e:
                return f"Error getting sea information: {str(e)}"
        
        def get_global_overview(query: str) -> str:
            """Get overview of global sea level trends"""
            try:
                overview = {
                    'global_average_rise_rate': '3.2 mm/year',
                    'total_seas_monitored': len(self.sea_regions),
                    'highest_risk_seas': [],
                    'lowest_risk_seas': [],
                    'data_period': f"{self.annual_data['Year'].min()}-{self.annual_data['Year'].max()}",
                    'ai_powered_by': 'Groq API + Risk Intelligence'
                }
                
                for sea, params in self.sea_regions.items():
                    if params['multiplier'] > 1.2:
                        overview['highest_risk_seas'].append(sea)
                    elif params['multiplier'] < 0.9:
                        overview['lowest_risk_seas'].append(sea)
                
                return json.dumps(overview, indent=2)
                
            except Exception as e:
                return f"Error getting global overview: {str(e)}"
        
        return [
            Tool(
                name="analyze_sea_level_prediction",
                description="Analyze sea level predictions for a specific sea and year. Can handle context like 'same sea'.",
                func=analyze_sea_level_prediction
            ),
            Tool(
                name="compare_seas",
                description="Compare sea level rise between different seas",
                func=compare_seas
            ),
            Tool(
                name="get_sea_info",
                description="Get detailed information about a specific sea",
                func=get_sea_info
            ),
            Tool(
                name="get_global_overview",
                description="Get overview of global sea level trends",
                func=get_global_overview
            )
        ]
    
    def _create_agent(self):
        try:
            prompt = hub.pull("hwchase17/react")
            logger.info("Using official ReAct prompt from hub")
        except Exception as e:
            logger.warning(f"Could not load prompt from hub: {e}, using manual prompt")
            prompt_template = """You are a helpful sea level analysis assistant. Answer questions about sea level predictions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

IMPORTANT: If a user refers to "the same sea", "that sea", or similar context, the tool will automatically use the previously mentioned sea.

Begin!

Question: {input}
Thought:{agent_scratchpad}"""
            
            prompt = PromptTemplate.from_template(prompt_template)
        
        agent = create_react_agent(self.llm, self.tools, prompt)
        return AgentExecutor(
            agent=agent, 
            tools=self.tools, 
            memory=self.memory, 
            verbose=False,
            max_iterations=5,
            max_execution_time=30,
            handle_parsing_errors=True,
            return_intermediate_steps=True
        )
    
    def process_query(self, user_input: str) -> dict:
        try:
            logger.info(f"Processing enhanced query: {user_input}")
            logger.info(f"Current context: last_sea={self.conversation_context['last_sea']}")
            
            # Preprocess query to replace context references
            processed_input = self._preprocess_context(user_input)
            
            # Get original agent response
            response = self.agent_executor.invoke({"input": processed_input})
            original_response = response["output"]
            logger.info(f"=== ORIGINAL AGENT RESPONSE ===")
            logger.info(f"Original response: {original_response}")
            
            # Enhance with risk intelligence
            enhanced_response = self.risk_enhancer.enhance_response(
                original_response, 
                user_input
            )
            
            logger.info(f"=== FINAL ENHANCED RESPONSE ===")
            logger.info(f"Enhanced response length: {len(enhanced_response)}")
            logger.info(f"Contains separator: {'━━━' in enhanced_response}")
            
            return {
                "response": enhanced_response,
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "powered_by": "Groq AI + Risk Intelligence + Context Memory"
            }
        except Exception as e:
            logger.error(f"Enhanced agent processing error: {str(e)}")
            logger.error(f"Full traceback: {traceback.format_exc()}")
            return {
                "response": f"I apologize, but I encountered an error processing your request. Please try rephrasing your question or ask about a specific sea and year for predictions.",
                "status": "error",
                "error_details": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    def _preprocess_context(self, user_input: str) -> str:
        """Preprocess user input to replace context references with actual values"""
        processed = user_input
        
        if self.conversation_context['last_sea']:
            # Replace context references with actual sea name
            context_patterns = [
                ('same sea', self.conversation_context['last_sea']),
                ('that sea', self.conversation_context['last_sea']),
                ('this sea', self.conversation_context['last_sea']),
                ('it', self.conversation_context['last_sea']),
                ('there', self.conversation_context['last_sea'])
            ]
            
            for pattern, replacement in context_patterns:
                if pattern in processed.lower():
                    processed = re.sub(
                        re.escape(pattern), 
                        replacement, 
                        processed, 
                        flags=re.IGNORECASE
                    )
                    logger.info(f"Replaced '{pattern}' with '{replacement}'")
                    break
        
        return processed

# Initialize enhanced agent
sea_level_agent = None
if AGENT_AVAILABLE:
    try:
        sea_level_agent = SeaLevelAgent(models, sea_regions, annual_data)
        logger.info("✅ Production-Ready Sea Level Agent initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize enhanced agent: {str(e)}")
        sea_level_agent = None

# API Endpoints
@app.route('/predict/<sea_name>/<int:year>', methods=['GET'])
def get_prediction(sea_name, year):
    try:
        logger.info(f"Received request for sea: {sea_name}, year: {year}")
        result = predict(sea_name, year)
        logger.info(f"Prediction result generated for {len(result['years'])} years")
        return jsonify(result)
    except Exception as e:
        logger.error(f"Endpoint error: {str(e)}")
        return jsonify({'error': 'Failed to process ML prediction', 'details': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy", 
        "message": "Production-Ready ML server with Context Memory is running",
        "agent_available": sea_level_agent is not None,
        "csv_data_found": sea_level_data is not None
    })

@app.route('/api/agent/query', methods=['POST'])
def agent_query():
    if not sea_level_agent:
        return jsonify({
            'error': 'Enhanced agent not available', 
            'message': 'Risk Intelligence AI agent is currently unavailable. Please check server configuration.'
        }), 503
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        user_input = data.get('query', '').strip()
        
        if not user_input:
            return jsonify({'error': 'No query provided'}), 400
        
        logger.info(f"Processing production agent query: {user_input}")
        result = sea_level_agent.process_query(user_input)
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Production agent query error: {str(e)}")
        return jsonify({
            'error': 'Failed to process query', 
            'details': str(e),
            'status': 'error'
        }), 500

@app.route('/api/agent/status', methods=['GET'])
def agent_status():
    return jsonify({
        'agent_available': sea_level_agent is not None,
        'supported_seas': list(sea_regions.keys()),
        'available_models': list(models.keys()) if models else [],
        'ai_provider': 'Groq + Risk Intelligence + Context Memory + Production Error Handling',
        'csv_data_found': sea_level_data is not None,
        'features': [
            'Human-friendly sea level predictions',
            'Risk assessment with visual analogies',
            'Population impact estimates',
            'Actionable recommendations',
            'Compelling narrative insights',
            'Sea comparison analysis',
            'Global trend overview',
            'Context memory for follow-up questions',
            'Production-grade error handling',
            'Strict input validation'
        ]
    })

@app.route('/api/agent/suggestions', methods=['GET'])
def get_suggestions():
    suggestions = [
        "What's the sea level prediction for Philippine Sea in 2030?",
        "Compare Arabian Sea and Caribbean Sea risk levels",
        "Which seas have the highest risk of sea level rise?",
        "Tell me about Barents Sea characteristics in 2035",
        "What about 2070 for the same sea?",
        "Show me predictions for Coral Sea by 2040"
    ]
    return jsonify({'suggestions': suggestions})

# Debug endpoint to check context
@app.route('/api/debug/context', methods=['GET'])
def debug_context():
    if sea_level_agent:
        return jsonify({
            'last_sea': sea_level_agent.conversation_context['last_sea'],
            'last_year': sea_level_agent.conversation_context['last_year'],
            'query_history': sea_level_agent.conversation_context['query_history']
        })
    return jsonify({'error': 'Agent not available'})

if __name__ == '__main__':
    logger.info("🚀 Starting Production-Ready Sea Level Prediction Server")
    app.run(debug=True, host='0.0.0.0', port=5000)
