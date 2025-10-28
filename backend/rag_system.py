# backend/rag_system.py - Climate Science RAG System
import os
import asyncio
from typing import List, Dict, Any
import logging
from datetime import datetime

# RAG imports
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.document_loaders import TextLoader, PyPDFLoader
from langchain.schema import Document

logger = logging.getLogger(__name__)

class ClimateRAGSystem:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        
        # Create knowledge base directory
        self.kb_path = os.path.join(os.path.dirname(__file__), "climate_knowledge_base")
        os.makedirs(self.kb_path, exist_ok=True)
        
        self.vector_store = None
        self.initialize_knowledge_base()
    
    def initialize_knowledge_base(self):
        """Initialize RAG system with climate science documents"""
        try:
            # Create scientific knowledge documents
            self._create_climate_documents()
            
            # Load and process documents
            documents = self._load_all_documents()
            
            if documents:
                # Split documents into chunks
                splits = self.text_splitter.split_documents(documents)
                
                # Create vector store
                self.vector_store = Chroma.from_documents(
                    documents=splits,
                    embedding=self.embeddings,
                    persist_directory=os.path.join(self.kb_path, "chroma_db")
                )
                
                logger.info(f"RAG system initialized with {len(splits)} document chunks")
            else:
                logger.warning("No documents found for RAG system")
                
        except Exception as e:
            logger.error(f"Failed to initialize RAG system: {str(e)}")
    
    def _create_climate_documents(self):
        """Create comprehensive climate science knowledge base"""
        
        # IPCC Summary Document
        ipcc_content = """
        INTERGOVERNMENTAL PANEL ON CLIMATE CHANGE (IPCC) - SEA LEVEL RISE SUMMARY
        
        Key Findings on Global Sea Level Rise:
        
        1. CURRENT TRENDS (2024):
        - Global mean sea level is rising at 3.4 ± 0.4 mm per year (2006-2018)
        - Acceleration observed: rate was 1.4 mm/year in 20th century
        - Total rise since 1900: approximately 21-24 centimeters
        
        2. REGIONAL VARIATIONS:
        - Philippine Sea: 2-3x global average due to thermal expansion
        - Arabian Sea: Near global average, influenced by monsoon patterns  
        - Caribbean Sea: Below global average due to ocean circulation
        - Coral Sea: Above global average, thermal expansion dominant
        - Barents Sea: High variability, Arctic amplification effects
        - Labrador Sea: Complex patterns due to glacial isostatic adjustment
        
        3. MAIN CONTRIBUTORS:
        - Thermal expansion of seawater: ~40% of observed rise
        - Glacial ice loss (Greenland, Antarctica): ~50% of rise
        - Mountain glaciers and ice caps: ~10% of rise
        - Changes in terrestrial water storage: Small contribution
        
        4. FUTURE PROJECTIONS:
        - RCP2.6 scenario: 43-84 cm rise by 2100
        - RCP8.5 scenario: 84-110 cm rise by 2100 (high confidence)
        - Post-2100: Continued rise for centuries even if emissions stop
        
        5. REGIONAL IMPACTS:
        - Small island developing states: Existential threat
        - Coastal megacities: Infrastructure and population at risk
        - Arctic regions: Accelerated coastal erosion
        - Deltaic regions: Compound flooding risks
        """
        
        # Regional Sea Characteristics
        regional_content = """
        DETAILED REGIONAL SEA LEVEL CHARACTERISTICS
        
        PHILIPPINE SEA:
        - Location: Western North Pacific, bounded by Japan, Philippines, Indonesia
        - Current sea level trend: +5-8 mm/year (2x-3x global average)
        - Primary drivers: Thermal expansion due to rapid ocean warming
        - Climate factors: El Niño/La Niña variations, Pacific Decadal Oscillation
        - Risk level: CRITICAL - highest rates globally
        - Human impact: 50+ million people in coastal areas at risk
        
        ARABIAN SEA:
        - Location: Northwestern Indian Ocean, bounded by India, Pakistan, Oman
        - Current trend: +3-4 mm/year (near global average)
        - Primary drivers: Monsoon-driven circulation changes, thermal expansion
        - Climate factors: Indian Ocean Dipole, monsoon intensity variations
        - Risk level: MODERATE - seasonal variability high
        - Human impact: Major coastal cities (Mumbai, Karachi) vulnerable
        
        CARIBBEAN SEA:
        - Location: Tropical Atlantic, bounded by Central America and islands
        - Current trend: +2-3 mm/year (below global average)
        - Primary drivers: Atlantic circulation patterns, hurricane activity
        - Climate factors: Atlantic Multidecadal Oscillation, AMOC changes
        - Risk level: MODERATE - hurricane storm surge compounds risk
        - Human impact: Small island states highly vulnerable
        
        CORAL SEA:
        - Location: Southwest Pacific, off Australia's northeast coast
        - Current trend: +4-6 mm/year (above global average)
        - Primary drivers: Thermal expansion, East Australian Current changes
        - Climate factors: ENSO variations, coral bleaching impacts
        - Risk level: HIGH - Great Barrier Reef ecosystem at risk
        - Human impact: Queensland coastal communities affected
        
        BARENTS SEA:
        - Location: Arctic Ocean, between Norway and Russia
        - Current trend: +3-7 mm/year (high variability)
        - Primary drivers: Arctic warming, sea ice loss, glacial isostatic adjustment
        - Climate factors: Arctic amplification, Atlantic water inflow
        - Risk level: HIGH - Arctic amplification effects
        - Human impact: Indigenous communities, Arctic infrastructure
        
        LABRADOR SEA:
        - Location: North Atlantic, between Canada and Greenland
        - Current trend: +1-3 mm/year (complex patterns)
        - Primary drivers: AMOC variations, Greenland ice sheet proximity
        - Climate factors: North Atlantic Oscillation, deep water formation
        - Risk level: MODERATE - glacial isostatic rebound partially offsets
        - Human impact: Newfoundland and Labrador coastal communities
        """
        
        # Adaptation Strategies
        adaptation_content = """
        SEA LEVEL RISE ADAPTATION AND MITIGATION STRATEGIES
        
        IMMEDIATE ACTIONS (2025-2030):
        1. Enhanced monitoring systems
        2. Early warning systems for coastal flooding
        3. Building codes updates for coastal construction
        4. Natural coastal defense restoration (mangroves, coral reefs)
        
        MEDIUM-TERM STRATEGIES (2030-2050):
        1. Engineered sea walls and flood barriers
        2. Managed retreat from highest-risk areas
        3. Floating and amphibious architecture
        4. Coastal ecosystem restoration at scale
        
        LONG-TERM ADAPTATION (2050-2100):
        1. Large-scale coastal protection infrastructure
        2. Planned relocation of communities
        3. New coastal management paradigms
        4. International cooperation frameworks
        
        COST ESTIMATES:
        - Global adaptation costs: $14-68 billion annually by 2100
        - Cost of inaction: $14.2 trillion by 2100 (global economic losses)
        - Benefit-cost ratios: 2:1 to 10:1 for most adaptation measures
        
        POLICY FRAMEWORKS:
        - Paris Agreement: Limit warming to 1.5°C to reduce sea level rise
        - Sendai Framework: Disaster risk reduction including sea level rise
        - UN SDGs: Sustainable coastal and marine ecosystem management
        """
        
        # Write documents to files
        documents = {
            "ipcc_sea_level_summary.txt": ipcc_content,
            "regional_sea_characteristics.txt": regional_content,
            "adaptation_strategies.txt": adaptation_content
        }
        
        for filename, content in documents.items():
            filepath = os.path.join(self.kb_path, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
        
        logger.info("Climate knowledge base documents created")
    
    def _load_all_documents(self) -> List[Document]:
        """Load all documents from the knowledge base directory"""
        documents = []
        
        for filename in os.listdir(self.kb_path):
            if filename.endswith('.txt'):
                filepath = os.path.join(self.kb_path, filename)
                try:
                    loader = TextLoader(filepath, encoding='utf-8')
                    docs = loader.load()
                    documents.extend(docs)
                    logger.info(f"Loaded document: {filename}")
                except Exception as e:
                    logger.error(f"Failed to load {filename}: {str(e)}")
        
        return documents
    
    def query_knowledge_base(self, query: str, k: int = 3) -> List[Dict[str, Any]]:
        """Query the RAG knowledge base"""
        try:
            if not self.vector_store:
                logger.warning("Vector store not initialized")
                return []
            
            # Perform similarity search
            relevant_docs = self.vector_store.similarity_search_with_score(query, k=k)
            
            results = []
            for doc, score in relevant_docs:
                results.append({
                    'content': doc.page_content,
                    'source': doc.metadata.get('source', 'unknown'),
                    'relevance_score': float(score),
                    'retrieved_at': datetime.now().isoformat()
                })
            
            logger.info(f"Retrieved {len(results)} relevant documents for query: {query[:50]}...")
            return results
            
        except Exception as e:
            logger.error(f"Error querying knowledge base: {str(e)}")
            return []
    
    def get_contextual_information(self, sea_region: str, topic: str = "sea level rise") -> str:
        """Get contextual information for enhanced responses"""
        try:
            query = f"{sea_region} {topic} characteristics trends impacts"
            relevant_docs = self.query_knowledge_base(query, k=2)
            
            if not relevant_docs:
                return ""
            
            # Combine relevant information
            context_parts = []
            for doc in relevant_docs:
                if doc['relevance_score'] < 1.5:  # Good relevance threshold
                    context_parts.append(doc['content'][:500])  # Limit length
            
            return "\n\n".join(context_parts)
            
        except Exception as e:
            logger.error(f"Error getting contextual information: {str(e)}")
            return ""

# Initialize RAG system
climate_rag = ClimateRAGSystem()
