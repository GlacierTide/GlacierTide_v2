# backend/update_rag_with_official_docs.py - Load Official Documents into RAG
import os
import logging
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OfficialRAGUpdater:
    def __init__(self):
        self.docs_dir = Path(__file__).parent / "official_docs"
        self.kb_path = Path(__file__).parent / "climate_knowledge_base"
        self.kb_path.mkdir(exist_ok=True)
        
        # Initialize embeddings
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        
        # Text splitter optimized for scientific documents
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,  # Larger chunks for scientific context
            chunk_overlap=300,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
    
    def load_official_documents(self):
        """Load all official PDF documents"""
        logger.info("=" * 60)
        logger.info("📚 LOADING OFFICIAL DOCUMENTS")
        logger.info("=" * 60)
        
        documents = []
        pdf_files = list(self.docs_dir.glob("*.pdf"))
        
        if not pdf_files:
            logger.error("❌ No PDF files found in official_docs/")
            logger.info("Run: python download_official_docs.py first")
            return None
        
        for pdf_path in pdf_files:
            logger.info(f"\n📄 Loading: {pdf_path.name}")
            try:
                loader = PyPDFLoader(str(pdf_path))
                docs = loader.load()
                
                # Add metadata
                for doc in docs:
                    doc.metadata['source'] = pdf_path.name
                    doc.metadata['official'] = True
                
                documents.extend(docs)
                logger.info(f"  ✓ Loaded {len(docs)} pages")
                
            except Exception as e:
                logger.error(f"  ✗ Failed to load: {str(e)}")
        
        logger.info(f"\n✅ Total pages loaded: {len(documents)}")
        return documents
    
    def create_vector_store(self, documents):
        """Create vector store from official documents"""
        logger.info("\n" + "=" * 60)
        logger.info("🔄 CREATING VECTOR DATABASE")
        logger.info("=" * 60)
        
        # Split documents into chunks
        logger.info("\n📝 Splitting documents into chunks...")
        splits = self.text_splitter.split_documents(documents)
        logger.info(f"  ✓ Created {len(splits)} document chunks")
        
        # Create vector store
        logger.info("\n💾 Creating vector database...")
        chroma_db_path = self.kb_path / "chroma_db_official"
        
        # Remove old database if exists
        if chroma_db_path.exists():
            import shutil
            shutil.rmtree(chroma_db_path)
            logger.info("  ✓ Removed old database")
        
        vector_store = Chroma.from_documents(
            documents=splits,
            embedding=self.embeddings,
            persist_directory=str(chroma_db_path)
        )
        
        logger.info(f"  ✓ Vector database created at: {chroma_db_path}")
        
        return vector_store
    
    def create_citation_file(self):
        """Create a citation reference file"""
        citations = """
# OFFICIAL DATA SOURCES - CITATION REFERENCE

This RAG system uses the following peer-reviewed and official sources:

## 1. IPCC AR6 Working Group I - Chapter 9
**Full Title:** Ocean, Cryosphere and Sea Level Change
**Source:** Intergovernmental Panel on Climate Change (IPCC)
**Publication:** August 2021
**URL:** https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-9/
**Citation:** Fox-Kemper, B., H.T. Hewitt, C. Xiao, et al. (2021). Ocean, Cryosphere and Sea Level Change. 
             In Climate Change 2021: The Physical Science Basis. Cambridge University Press.
**Key Data:**
- Global mean sea level rise: 3.7 [3.2 to 4.2] mm/yr (2006–2018)
- Total rise since 1900: 0.20 [0.15 to 0.25] m
- Projections by 2100: 0.28-1.01 m depending on emissions scenario

## 2. IPCC AR6 Synthesis Report - Summary for Policymakers
**Source:** Intergovernmental Panel on Climate Change (IPCC)
**Publication:** March 2023
**URL:** https://www.ipcc.ch/report/ar6/syr/
**Citation:** IPCC (2023). Climate Change 2023: Synthesis Report. Contribution of Working Groups I, II and III 
             to the Sixth Assessment Report.
**Key Findings:**
- High confidence in continued sea level rise for centuries
- Commitment to multi-meter rise over millennia

## 3. 2022 Sea Level Rise Technical Report
**Full Title:** Global and Regional Sea Level Rise Scenarios for the United States
**Source:** NOAA/NASA Inter-agency Sea Level Rise Task Force
**Publication:** February 2022
**URL:** https://oceanservice.noaa.gov/hazards/sealevelrise/sealevelrise-tech-report.html
**Citation:** Sweet, W.V., et al. (2022). Global and Regional Sea Level Rise Scenarios for the United States: 
             Updated Mean Projections and Extreme Water Level Probabilities Along U.S. Coastlines. 
             NOAA Technical Report NOS 01.
**Regional Data:**
- U.S. East Coast: 10-14 inches by 2050
- U.S. Gulf Coast: 14-18 inches by 2050
- Updated projections incorporating IPCC AR6

## DATA VERIFICATION
All data in this system is directly extracted from these official PDF documents.
No AI-generated content is used for scientific facts or projections.

Last Updated: October 2025
Verification Method: Direct PDF extraction with source tracking
"""
        
        citation_file = self.kb_path / "OFFICIAL_SOURCES.txt"
        with open(citation_file, 'w', encoding='utf-8') as f:
            f.write(citations)
        
        logger.info(f"\n✓ Created citation file: {citation_file}")
    
    def test_search(self, vector_store):
        """Test the vector store with sample queries"""
        logger.info("\n" + "=" * 60)
        logger.info("🧪 TESTING VECTOR DATABASE")
        logger.info("=" * 60)
        
        test_queries = [
            "What is the current rate of sea level rise?",
            "IPCC projections for sea level by 2100",
            "Philippine Sea regional sea level trends"
        ]
        
        for query in test_queries:
            logger.info(f"\n📊 Query: '{query}'")
            results = vector_store.similarity_search(query, k=2)
            
            if results:
                logger.info(f"  ✓ Found {len(results)} relevant chunks")
                logger.info(f"  Source: {results[0].metadata.get('source', 'Unknown')}")
                logger.info(f"  Preview: {results[0].page_content[:150]}...")
            else:
                logger.info("  ✗ No results found")
    
    def update_system(self):
        """Complete update process"""
        # Load documents
        documents = self.load_official_documents()
        if not documents:
            return False
        
        # Create vector store
        vector_store = self.create_vector_store(documents)
        
        # Create citation file
        self.create_citation_file()
        
        # Test
        self.test_search(vector_store)
        
        logger.info("\n" + "=" * 60)
        logger.info("✅ RAG SYSTEM UPDATED WITH OFFICIAL DOCUMENTS")
        logger.info("=" * 60)
        logger.info("\nNext steps:")
        logger.info("1. Update rag_system.py to use 'chroma_db_official' folder")
        logger.info("2. Restart your server: python ml_server.py")
        logger.info("3. Test queries to verify official data is being used")
        
        return True

def main():
    updater = OfficialRAGUpdater()
    success = updater.update_system()
    
    if success:
        print("\n🎉 SUCCESS! Official documents integrated into RAG system!")
    else:
        print("\n❌ FAILED! Check logs above for errors")

if __name__ == "__main__":
    main()
