# backend/rag_system.py - UPDATED Climate Science RAG System with Official Documents
import os
import logging
from pathlib import Path
from typing import List, Dict
from datetime import datetime

from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

logger = logging.getLogger(__name__)

class ClimateRAGSystem:
    def __init__(self):
        # Setup paths
        self.kb_path = Path(__file__).parent / "climate_knowledge_base"
        self.kb_path.mkdir(exist_ok=True)
        
        self.official_docs_path = Path(__file__).parent / "official_docs"
        self.official_docs_path.mkdir(exist_ok=True)
        
        # Initialize embeddings
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        
        # Text splitter for documents
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,
            chunk_overlap=300,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        
        self.vector_store = None
        self.initialize_knowledge_base()
    
    def initialize_knowledge_base(self):
        """Initialize RAG system - prioritize official documents, fallback to placeholder"""
        try:
            # PRIORITY 1: Try to load official documents database
            official_db_path = os.path.join(self.kb_path, "chroma_db_official")
            
            if os.path.exists(official_db_path):
                logger.info("📚 Loading OFFICIAL document database...")
                self.vector_store = Chroma(
                    persist_directory=official_db_path,
                    embedding_function=self.embeddings
                )
                doc_count = self.vector_store._collection.count()
                logger.info(f"✅ Loaded official database with {doc_count} document chunks")
                logger.info("✓ Using IPCC AR6, NASA, and NOAA official reports")
                return
            
            # PRIORITY 2: Try to load official PDFs and create database
            pdf_files = list(self.official_docs_path.glob("*.pdf"))
            if pdf_files:
                logger.info("📥 Found official PDF documents - creating database...")
                success = self._load_official_pdfs()
                if success:
                    return
            
            # PRIORITY 3: Fallback to placeholder data with disclaimer
            logger.warning("⚠️  No official documents found - using placeholder data")
            logger.warning("⚠️  For production use, run: python download_official_docs.py")
            logger.warning("⚠️  Then run: python update_rag_with_official_docs.py")
            
            self._create_placeholder_knowledge_base()
            
        except Exception as e:
            logger.error(f"Failed to initialize RAG system: {str(e)}")
            logger.info("Creating minimal fallback knowledge base...")
            self._create_minimal_fallback()
    
    def _load_official_pdfs(self) -> bool:
        """Load official PDF documents and create vector database"""
        try:
            documents = []
            pdf_files = list(self.official_docs_path.glob("*.pdf"))
            
            for pdf_path in pdf_files:
                logger.info(f"  Loading: {pdf_path.name}")
                loader = PyPDFLoader(str(pdf_path))
                docs = loader.load()
                
                # Add metadata
                for doc in docs:
                    doc.metadata['source'] = pdf_path.name
                    doc.metadata['official'] = True
                    doc.metadata['type'] = 'peer_reviewed'
                
                documents.extend(docs)
            
            if not documents:
                return False
            
            logger.info(f"  ✓ Loaded {len(documents)} pages from official documents")
            
            # Split and create vector store
            splits = self.text_splitter.split_documents(documents)
            logger.info(f"  ✓ Created {len(splits)} document chunks")
            
            chroma_db_path = os.path.join(self.kb_path, "chroma_db_official")
            self.vector_store = Chroma.from_documents(
                documents=splits,
                embedding=self.embeddings,
                persist_directory=chroma_db_path
            )
            
            logger.info(f"✅ Official document database created successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load official PDFs: {str(e)}")
            return False
    
    def _create_placeholder_knowledge_base(self):
        """Create placeholder knowledge base with clear disclaimers"""
        logger.info("Creating placeholder climate knowledge base...")
        
        # Create placeholder documents with disclaimers
        self._create_climate_documents()
        
        # Load documents
        documents = []
        for filename in ["adaptation_strategies.txt", "ipcc_sea_level_summary.txt", 
                        "regional_sea_characteristics.txt"]:
            file_path = os.path.join(self.kb_path, filename)
            if os.path.exists(file_path):
                loader = TextLoader(file_path, encoding='utf-8')
                docs = loader.load()
                
                # Add disclaimer metadata
                for doc in docs:
                    doc.metadata['source'] = filename
                    doc.metadata['official'] = False
                    doc.metadata['type'] = 'placeholder_demonstration_only'
                
                documents.extend(docs)
                logger.info(f"Loaded document: {filename}")
        
        if not documents:
            raise Exception("Failed to create any knowledge base documents")
        
        # Split and create vector store
        splits = self.text_splitter.split_documents(documents)
        
        chroma_db_path = os.path.join(self.kb_path, "chroma_db")
        self.vector_store = Chroma.from_documents(
            documents=splits,
            embedding=self.embeddings,
            persist_directory=chroma_db_path
        )
        
        logger.info(f"RAG system initialized with {len(splits)} document chunks (PLACEHOLDER DATA)")
    
    def _create_climate_documents(self):
        """Create placeholder climate science documents with disclaimers"""
        
        disclaimer = """
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PLACEHOLDER DATA DISCLAIMER ⚠️

This document contains demonstration data for technical proof-of-concept.
For production use, official IPCC/NASA/NOAA documents should be used.

To use official documents:
1. Run: python download_official_docs.py
2. Run: python update_rag_with_official_docs.py
3. Restart server

Official sources:
- IPCC AR6 Report: https://www.ipcc.ch/report/ar6/
- NASA Sea Level Portal: https://sealevel.nasa.gov
- NOAA Climate Data: https://www.climate.gov
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""
        
        # IPCC Summary with sources
        ipcc_content = f"""{disclaimer}

INTERGOVERNMENTAL PANEL ON CLIMATE CHANGE (IPCC) - SEA LEVEL RISE SUMMARY
(Based on publicly available IPCC reports - placeholder for demonstration)

Source References:
- IPCC AR6 WGI Chapter 9: https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-9/
- IPCC SROCC Report: https://www.ipcc.ch/srocc/

Key Findings on Global Sea Level Rise:

1. CURRENT TRENDS (Based on IPCC AR6):
- Global mean sea level rise: approximately 3.4-3.7 mm per year (2006-2018)
- Acceleration observed: rate was approximately 1.4 mm/year in 20th century
- Total rise since 1900: approximately 21-24 centimeters
- Source: IPCC AR6 WGI Chapter 9, Section 9.6.1

2. REGIONAL VARIATIONS (Demonstration estimates):
- Western Pacific (Philippine Sea region): 2-3x global average
- Arabian Sea: Near global average
- Caribbean Sea: Below global average
- Note: For exact regional data, consult official IPCC regional chapters

3. MAIN CONTRIBUTORS (IPCC AR6):
- Thermal expansion of seawater: ~40% of observed rise
- Glacial ice loss (Greenland, Antarctica): ~50% of rise
- Mountain glaciers and ice caps: ~10% of rise
- Changes in terrestrial water storage: Small contribution

4. FUTURE PROJECTIONS (IPCC AR6 scenarios):
- Low emissions (SSP1-2.6): 0.28-0.55 m rise by 2100
- High emissions (SSP5-8.5): 0.63-1.01 m rise by 2100
- Post-2100: Continued rise for centuries even if emissions stop

5. REGIONAL IMPACTS (General estimates):
- Small island developing states: Existential threat
- Coastal megacities: Infrastructure and population at risk
- Arctic regions: Accelerated coastal erosion
- Deltaic regions: Compound flooding risks

CITATION REMINDER: Always verify against original IPCC reports at www.ipcc.ch
"""
        
        # Regional characteristics with sources
        regional_content = f"""{disclaimer}

REGIONAL SEA LEVEL CHARACTERISTICS
(Demonstration data - verify against NASA/NOAA regional analyses)

Recommended sources for regional data:
- NASA Sea Level Portal: https://sealevel.nasa.gov/data_tools/17
- NOAA Sea Level Trends: https://tidesandcurrents.noaa.gov/sltrends/

PHILIPPINE SEA:
- Location: Western North Pacific, bounded by Japan, Philippines, Indonesia
- Estimated trend: Higher than global average
- Primary drivers: Thermal expansion, Western Pacific warm pool effects
- Climate factors: El Niño/La Niña variations, Pacific Decadal Oscillation
- Risk level: High vulnerability region
- Recommended verification: NASA satellite altimetry data for exact trends

ARABIAN SEA:
- Location: Northwestern Indian Ocean, bounded by India, Pakistan, Oman
- Estimated trend: Near global average
- Primary drivers: Monsoon-driven circulation changes, thermal expansion
- Climate factors: Indian Ocean Dipole, monsoon intensity variations
- Recommended verification: NOAA tide gauge data from regional stations

CARIBBEAN SEA:
- Location: Tropical Atlantic, bounded by Central America and islands
- Estimated trend: Variable regional patterns
- Primary drivers: Atlantic circulation patterns, hurricane activity
- Climate factors: Atlantic Multidecadal Oscillation
- Recommended verification: IPCC regional sea level assessments

CORAL SEA:
- Location: Southwest Pacific, off Australia's northeast coast
- Estimated trend: Above global average in some areas
- Primary drivers: Thermal expansion, East Australian Current changes
- Climate factors: ENSO variations
- Recommended verification: Australian Bureau of Meteorology data

BARENTS SEA:
- Location: Arctic Ocean, between Norway and Russia
- Estimated trend: High variability due to Arctic processes
- Primary drivers: Arctic warming, sea ice loss
- Climate factors: Arctic amplification
- Recommended verification: Arctic Climate Impact Assessment reports

LABRADOR SEA:
- Location: North Atlantic, between Canada and Greenland
- Estimated trend: Complex patterns
- Primary drivers: AMOC variations, glacial isostatic adjustment
- Climate factors: North Atlantic Oscillation
- Recommended verification: Canadian sea level monitoring programs

NOTE: These are general regional characteristics. For research or policy decisions,
consult official regional assessments from IPCC, NASA, and national agencies.
"""
        
        # Adaptation strategies
        adaptation_content = f"""{disclaimer}

SEA LEVEL RISE ADAPTATION AND MITIGATION STRATEGIES
(Based on IPCC adaptation guidance - demonstration summary)

Official adaptation guidance sources:
- IPCC AR6 WGII: https://www.ipcc.ch/report/ar6/wg2/
- UNEP Adaptation Gap Report: https://www.unep.org/resources/adaptation-gap-report

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

COST CONSIDERATIONS (estimates from various sources):
- Adaptation investments needed globally
- Cost-benefit analyses favor early action
- Economic losses from inaction are substantial

POLICY FRAMEWORKS:
- Paris Agreement: Climate mitigation to reduce sea level rise
- Sendai Framework: Disaster risk reduction
- UN SDGs: Sustainable coastal management

RECOMMENDATION: Consult national adaptation plans and IPCC WGII reports
for region-specific adaptation strategies and cost analyses.
"""
        
        # Write documents
        documents = {
            "ipcc_sea_level_summary.txt": ipcc_content,
            "regional_sea_characteristics.txt": regional_content,
            "adaptation_strategies.txt": adaptation_content
        }
        
        for filename, content in documents.items():
            filepath = os.path.join(self.kb_path, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
        
        logger.info("Climate knowledge base documents created (with disclaimers)")
    
    def _create_minimal_fallback(self):
        """Create absolute minimal fallback"""
        minimal_content = """
Sea level rise is occurring globally due to climate change.
Current global average: approximately 3.4 mm per year.
Regional variations exist.
For accurate data, consult IPCC, NASA, or NOAA official sources.
"""
        
        filepath = os.path.join(self.kb_path, "minimal_fallback.txt")
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(minimal_content)
        
        loader = TextLoader(filepath, encoding='utf-8')
        documents = loader.load()
        
        splits = self.text_splitter.split_documents(documents)
        
        chroma_db_path = os.path.join(self.kb_path, "chroma_db_fallback")
        self.vector_store = Chroma.from_documents(
            documents=splits,
            embedding=self.embeddings,
            persist_directory=chroma_db_path
        )
        
        logger.info("Minimal fallback knowledge base created")
    
    def query_knowledge_base(self, query: str, k: int = 3) -> List[Dict]:
        """Query the knowledge base for relevant information"""
        try:
            if not self.vector_store:
                logger.error("Vector store not initialized")
                return []
            
            results = self.vector_store.similarity_search_with_score(query, k=k)
            
            formatted_results = []
            for doc, score in results:
                formatted_results.append({
                    'content': doc.page_content,
                    'source': doc.metadata.get('source', 'Unknown'),
                    'official': doc.metadata.get('official', False),
                    'type': doc.metadata.get('type', 'unknown'),
                    'relevance_score': float(1 - score)  # Convert distance to similarity
                })
            
            logger.info(f"Retrieved {len(formatted_results)} relevant documents for query: {query[:50]}...")
            return formatted_results
            
        except Exception as e:
            logger.error(f"Knowledge base query error: {str(e)}")
            return []
    
    def get_contextual_information(self, sea_name: str, additional_context: str = "") -> str:
        """Get contextual information about a specific sea"""
        try:
            query = f"{sea_name} {additional_context}"
            results = self.query_knowledge_base(query, k=2)
            
            if not results:
                return ""
            
            # Combine relevant context
            context = "\n\n".join([
                f"[Source: {r['source']}]\n{r['content'][:500]}"
                for r in results[:2]
            ])
            
            return context
            
        except Exception as e:
            logger.error(f"Error getting contextual information: {str(e)}")
            return ""
    
    def get_system_status(self) -> Dict:
        """Get status information about the RAG system"""
        try:
            official_db_exists = os.path.exists(os.path.join(self.kb_path, "chroma_db_official"))
            pdf_count = len(list(self.official_docs_path.glob("*.pdf")))
            
            doc_count = 0
            using_official = False
            
            if self.vector_store:
                doc_count = self.vector_store._collection.count()
                # Check if using official docs
                sample_doc = self.vector_store.similarity_search("test", k=1)
                if sample_doc:
                    using_official = sample_doc[0].metadata.get('official', False)
            
            return {
                'initialized': self.vector_store is not None,
                'document_count': doc_count,
                'using_official_documents': using_official,
                'official_database_exists': official_db_exists,
                'official_pdfs_available': pdf_count,
                'status': 'official' if using_official else 'placeholder',
                'recommendation': 'Production-ready' if using_official else 'Run download_official_docs.py for production use'
            }
        except Exception as e:
            return {
                'initialized': False,
                'error': str(e)
            }

# Create global instance
climate_rag = ClimateRAGSystem()

# Export
__all__ = ['climate_rag', 'ClimateRAGSystem']
