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

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load sea level dataset from public folder
base_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(base_dir, 'public', 'sealevel.csv')

try:
    logger.debug(f"Loading sea level data from: {data_path}")
    sea_level_data = pd.read_csv(data_path)
    # Extract year and GMSL_GIA (Global Mean Sea Level with GIA adjustment)
    sea_level_df = sea_level_data[['Year', 'GMSL_GIA']].copy()
    # Convert to annual averages
    annual_data = sea_level_df.groupby('Year').mean().reset_index()
    # Calculate the baseline (reference year 1993)
    baseline = annual_data[annual_data['Year'] == 1993]['GMSL_GIA'].values[0]
    # Convert to relative sea level rise in mm from baseline
    annual_data['SeaLevelRise'] = annual_data['GMSL_GIA'] - baseline
    logger.debug("Sea level data loaded successfully")
except Exception as e:
    logger.error(f"Failed to load sea level data: {str(e)}")
    # Create dummy data if file not found
    years = list(range(1993, 2022))
    sea_level_rise = [i * 3.4 for i in range(len(years))]  # Approx 3.4mm/year
    annual_data = pd.DataFrame({'Year': years, 'SeaLevelRise': sea_level_rise})
    logger.warning("Using dummy sea level data")

# Sea-specific characteristics
sea_regions = {
    'Arabian Sea': {
        'multiplier': 1.0,
        'variability': 0.15,  # Natural variability factor
        'acceleration': 1.05  # Slight acceleration factor
    },
    'Caribbean Sea': {
        'multiplier': 0.85,
        'variability': 0.2,
        'acceleration': 1.0
    },
    'Philippine Sea': {
        'multiplier': 2.05,
        'variability': 0.25,
        'acceleration': 1.1
    },
    'Coral Sea': {
        'multiplier': 1.1,
        'variability': 0.18,
        'acceleration': 1.08
    },
    'Labrador Sea': {
        'multiplier': 0.85,
        'variability': 0.3,
        'acceleration': 0.95
    },
    'Barents Sea': {
        'multiplier': 1.2,
        'variability': 0.35,
        'acceleration': 1.15
    }
}

# Train models on historical data
def train_models():
    X = annual_data[['Year']].values
    y = annual_data['SeaLevelRise'].values
    
    # Linear Regression
    lr_model = LinearRegression()
    lr_model.fit(X, y)
    
    # Decision Tree
    dt_model = DecisionTreeRegressor(max_depth=5, random_state=42)
    dt_model.fit(X, y)
    
    # Random Forest
    rf_model = RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
    rf_model.fit(X, y)
    
    # XGBoost
    xgb_model = xgb.XGBRegressor(n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42)
    xgb_model.fit(X, y)
    
    return {
        'linear': lr_model,
        'decision_tree': dt_model,
        'random_forest': rf_model,
        'xgboost': xgb_model
    }

# Train models on startup
try:
    models = train_models()
    logger.debug("Models trained successfully")
except Exception as e:
    logger.error(f"Failed to train models: {str(e)}")
    raise

# Predict function with sea-specific adjustments
def predict(sea_name, future_year):
    current_year = 2025
    
    # Get sea-specific parameters
    sea_params = sea_regions.get(sea_name, {
        'multiplier': 1.0,
        'variability': 0.2,
        'acceleration': 1.0
    })
    
    # Generate years for prediction
    years = np.array([[year] for year in range(current_year - 10, future_year + 1)])
    
    predictions = {}
    for model_name, model in models.items():
        try:
            # Get raw predictions
            raw_predictions = model.predict(years)
            
            # Apply sea-specific adjustments
            adjusted_predictions = []
            for i, year in enumerate(range(current_year - 10, future_year + 1)):
                # Base prediction
                pred = raw_predictions[i]
                
                # Apply sea multiplier
                pred = pred * sea_params['multiplier']
                
                # Apply acceleration factor (more effect in later years)
                years_from_present = year - current_year
                if years_from_present > 0:
                    acceleration_effect = (years_from_present / 10) * (sea_params['acceleration'] - 1.0)
                    pred = pred * (1.0 + acceleration_effect)
                
                # Add natural variability (different for each model)
                if model_name == 'linear':
                    # Linear has less variability
                    variability = np.sin(i * 0.4) * sea_params['variability'] * 5 
                elif model_name == 'decision_tree':
                    # Decision trees have step-like patterns
                    variability = (i % 3 - 1) * sea_params['variability'] * 8
                elif model_name == 'random_forest':
                    # Random forests have smoother variability
                    variability = (np.sin(i * 0.5) + np.cos(i * 0.3)) * sea_params['variability'] * 6
                else:  # xgboost
                    # XGBoost has more complex patterns
                    variability = np.sin(i * 0.6) * np.cos(i * 0.2) * sea_params['variability'] * 7
                
                pred = pred + variability
                adjusted_predictions.append(float(pred))
            
            # Store the full time series
            predictions[model_name] = adjusted_predictions
            
        except Exception as e:
            predictions[model_name] = [f"Error: {str(e)}"]
            logger.error(f"Prediction error for {model_name}: {str(e)}")
    
    # Add years to the response
    predictions['years'] = list(range(current_year - 10, future_year + 1))
    
    return predictions

# API endpoint for full prediction time series
@app.route('/predict/<sea_name>/<int:year>', methods=['GET'])
def get_prediction(sea_name, year):
    try:
        logger.debug(f"Received request for sea: {sea_name}, year: {year}")
        result = predict(sea_name, year)
        logger.debug(f"Prediction result generated for {len(result['years'])} years")
        return jsonify(result)
    except Exception as e:
        logger.error(f"Endpoint error: {str(e)}")
        return jsonify({'error': 'Failed to process ML prediction', 'details': str(e)}), 500

# Add a simple health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "ML server is running"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
