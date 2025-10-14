# 🌊 GlacierTide

<div align="center">

**AI-Powered Climate Monitoring & Sea Level Prediction Platform**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/AI-Groq_Gemma2-FF6B35)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Transforming climate data into actionable intelligence with machine learning and conversational AI*

[Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Machine Learning Models](#-machine-learning-models)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 Overview

**GlacierTide** is a comprehensive climate change monitoring platform that combines advanced machine learning predictions with conversational AI to deliver human-friendly sea level rise assessments. The platform analyzes historical satellite data from 1993-2022 and projects sea level changes up to 2100 across six critical ocean regions worldwide.

### Why GlacierTide?

- **🎯 Human-Centered Risk Assessment**: Transforms complex ML predictions into relatable visual analogies and actionable insights
- **🤖 Conversational AI Interface**: Natural language queries powered by Groq's Gemma2-9B model with LangChain agent framework
- **📊 Multi-Model Predictions**: Leverages 4 ML algorithms (Linear Regression, Decision Trees, Random Forests, XGBoost) for robust forecasting
- **🌐 Interactive Visualizations**: 3D globe visualization, interactive maps, and real-time prediction charts
- **👥 Population Impact Analysis**: Estimates affected populations and infrastructure risks for each region
- **🔒 Secure Authentication**: JWT-based auth with email verification via SendGrid

---

## ✨ Features

### 🧠 AI-Powered Intelligence

- **Context-Aware Agent**: Maintains conversation memory for follow-up queries ("What about 2070 for the same sea?")
- **Risk Intelligence Engine**: Automatically generates risk classifications (Critical/High/Medium/Low) with visual analogies
- **Human Impact Estimation**: Calculates affected populations and infrastructure vulnerabilities
- **Actionable Recommendations**: Provides timeline-specific adaptation strategies

### 📈 Prediction Capabilities

- **6 Monitored Seas**: Arabian Sea, Caribbean Sea, Philippine Sea, Coral Sea, Labrador Sea, Barents Sea
- **Multi-Model Ensemble**: Combines predictions from 4 different ML algorithms for accuracy
- **Regional Variations**: Accounts for sea-specific multipliers, variability, and acceleration factors
- **Extended Forecasts**: Predictions spanning from 2025 to 2100

### 🎨 Interactive Interface

- **3D Earth Globe**: Three.js-powered interactive visualization with real-time sea markers
- **Leaflet Maps**: Interactive 2D maps with clustering and detailed region information
- **Chart.js Analytics**: Dynamic prediction charts with multi-model comparisons
- **Responsive Design**: Mobile-first TailwindCSS interface with dark mode support

### 🔐 User Management

- **Secure Authentication**: bcrypt password hashing with JWT tokens
- **Email Verification**: SendGrid-powered email confirmation system
- **Protected Routes**: Client-side route guards for authenticated features
- **Session Management**: Persistent login with token refresh

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](./screenshots/landing.jpg)
*Clean, modern landing page with animated particle effects showcasing GlacierTide's mission*

### 🌍 Interactive 3D Globe
![3D Globe Visualization](./screenshots/globe.jpg)
*Explore Earth in 3D with interactive sea region markers - powered by Three.js*

### 📊 Prediction Tool
![Prediction Tool](./screenshots/prediction-tool.jpg)
*Select any sea region and timeframe to generate ML-powered sea level rise forecasts with visual charts*

### 🗺️ World Map Interface
![World Map](./screenshots/world-map.jpg)
*Interactive Leaflet map with clustered markers showing 1048+ data points from 1993-2021*

### 🤖 AI Sea Level Assistant
![AI Assistant](./screenshots/ai-assistant.jpg)
*Conversational AI powered by Groq - ask natural language questions about sea level predictions*

---

## 🎬 Demo

### Conversational AI Query Example

User: "What's the sea level prediction for Philippine Sea in 2030?"

GlacierTide Agent:
The average predicted sea level rise for the Philippine Sea by 2030 is 267.45mm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 RISK ASSESSMENT
🔴 CRITICAL RISK - Water rising about the height of a dining table leg (267.5mm)

👥 HUMAN IMPACT
Around 3,750,000 people and Major ports, airports, and hospitals could face
regular flooding impacts

⚡ RECOMMENDED ACTION
🚨 Begin immediate adaptation planning - consider sea walls, building elevation,
or managed retreat options by 2028

🌊 EXPERT INSIGHT
The Philippine Sea is entering a critical acceleration phase—like watching a
slow-motion avalanche that's picking up speed. The window for adaptation is narrowing.

text

### Key Interactive Features

- **3D Globe Navigation**: Rotate, zoom, and click sea markers for instant information
- **Real-Time Predictions**: Select any sea and future year (2025-2100) for ML-powered forecasts
- **Sea Comparisons**: Side-by-side risk analysis of multiple ocean regions
- **Historical Trends**: Visualize 30+ years of satellite altimeter data (1993-2021)
- **AI Chat Memory**: Follow-up questions like "What about 2040 for the same sea?" work seamlessly

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | Modern UI framework with concurrent features |
| **Vite 6.2** | Lightning-fast build tool and dev server |
| **TailwindCSS 3.4** | Utility-first CSS framework |
| **Three.js** | 3D globe visualization and animations |
| **React Leaflet** | Interactive mapping with marker clustering |
| **Chart.js** | Responsive prediction charts |
| **React Router 7** | Client-side routing with protected routes |
| **Axios** | HTTP client for API communication |
| **Lucide React** | Modern icon library |
| **React Particles** | Animated particle backgrounds |

### Backend (Node.js)

| Technology | Purpose |
|------------|---------|
| **Express.js** | RESTful API server and proxy middleware |
| **MongoDB + Mongoose** | Database for user management |
| **JWT** | Secure token-based authentication |
| **bcryptjs** | Password hashing |
| **SendGrid** | Email verification service |
| **CORS** | Cross-origin resource sharing |

### ML Backend (Python/Flask)

| Technology | Purpose |
|------------|---------|
| **Flask** | Lightweight ML API server |
| **scikit-learn** | ML models (Linear, Decision Tree, Random Forest) |
| **XGBoost** | Gradient boosting predictions |
| **Pandas & NumPy** | Data processing and manipulation |
| **LangChain** | Agent framework for conversational AI |
| **Groq API** | Gemma2-9B LLM inference (ultra-fast) |
| **Flask-CORS** | API accessibility |

### DevOps & Tools

- **Python dotenv**: Environment variable management
- **ESLint**: Code quality enforcement
- **PostCSS**: CSS transformation pipeline
- **Autoprefixer**: CSS vendor prefixing

---

## 🏗 Architecture

GlacierTide/
├── frontend/ # React application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ │ ├── ui/ # Base UI elements
│ │ │ ├── Footer.jsx
│ │ │ ├── Hero.jsx
│ │ │ ├── Layout.jsx
│ │ │ ├── Marker.jsx
│ │ │ ├── Navbar.jsx
│ │ │ ├── Popup.jsx
│ │ │ ├── PrivateRoute.jsx
│ │ │ └── SeaLevelAgent.jsx # AI chat interface
│ │ ├── pages/ # Route components
│ │ │ ├── About.jsx
│ │ │ ├── Contact.jsx
│ │ │ ├── Globe.jsx # 3D visualization
│ │ │ ├── Index.jsx
│ │ │ ├── NotFound.jsx
│ │ │ ├── PredictionTool.jsx # ML predictions UI
│ │ │ ├── SignIn.jsx
│ │ │ ├── SignUp.jsx
│ │ │ └── WorldMap.jsx # 2D map interface
│ │ ├── lib/ # Utility functions
│ │ ├── hooks/ # Custom React hooks
│ │ ├── assets/ # Static resources
│ │ └── App.jsx # Root component
│ ├── public/
│ │ ├── textures/ # Earth textures for 3D globe
│ │ └── sealevel.csv # Historical sea level data
│ └── package.json
│
├── backend/ # Node.js/Express server
│ ├── controllers/
│ │ └── authController.js # Authentication logic
│ ├── models/
│ │ └── User.js # Mongoose user schema
│ ├── routes/
│ │ └── authRoutes.js # API route definitions
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── server.js # Express server entry point
│ └── package.json
│
├── ml_backend/ # Python/Flask ML server
│ ├── models/ # Trained ML models (pkl files)
│ │ ├── decision_tree_model.pkl
│ │ ├── kmeans_model.pkl
│ │ ├── linear_model.pkl
│ │ ├── random_forest_model.pkl
│ │ └── xgboost_model.pkl
│ ├── ml_server.py # Flask API + LangChain agent
│ ├── requirements.txt
│ └── .env # Groq API key
│
└── README.md

text

### Data Flow Architecture

┌─────────────┐
│ User UI │ (React Components)
└──────┬──────┘
│
▼
┌─────────────────────────┐
│ SeaLevelAgent.jsx │ (AI Chat Interface)
│ PredictionTool.jsx │ (Prediction Dashboard)
└──────────┬──────────────┘
│ HTTP Request
▼
┌─────────────────────────┐
│ Express Proxy │ (Port 8800)
│ /api/agent/query │
│ /api/ml/predict │
└──────────┬──────────────┘
│ Forwarded Request
▼
┌─────────────────────────┐
│ Flask ML Server │ (Port 5000)
│ LangChain Agent │
│ 4 ML Models │
│ Risk Enhancer │
└──────────┬──────────────┘
│
├─── Tool: analyze_sea_level_prediction
├─── Tool: compare_seas
├─── Tool: get_sea_info
└─── Tool: get_global_overview
│
▼
┌─────────────────────────┐
│ ML Model Predictions │
│ - Linear Regression │
│ - Decision Tree │
│ - Random Forest │
│ - XGBoost │
└──────────┬──────────────┘
│
▼
┌─────────────────────────┐
│ Risk Enhancement │
│ - Risk Classification │
│ - Visual Analogies │
│ - Human Impact │
│ - Recommendations │
└──────────┬──────────────┘
│ JSON Response
▼
┌─────────────────────────┐
│ Frontend Visualization │
│ - Charts (Chart.js) │
│ - Maps (Leaflet) │
│ - AI Response Display │
└─────────────────────────┘

text

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **MongoDB** (local or Atlas cluster)
- **Groq API Key** ([Get one here](https://console.groq.com/))
- **SendGrid API Key** (for email verification)

### Step 1: Clone the Repository

git clone https://github.com/yourusername/glaciertide.git
cd glaciertide

text

### Step 2: Frontend Setup

Install dependencies
npm install

Create .env file (if needed)
Add any frontend environment variables
text

### Step 3: Backend Setup

cd backend

Install dependencies
npm install

Create .env file
cat > .env << EOL
PORT=8800
MONGODB_URI=mongodb://localhost:27017/glaciertide
JWT_SECRET=your_jwt_secret_key_here
SENDGRID_API_KEY=your_sendgrid_api_key
VERIFICATION_EMAIL=noreply@glaciertide.com
EOL

text

### Step 4: ML Backend Setup

cd ../ml_backend

Create virtual environment
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

Install dependencies
pip install -r requirements.txt

Create .env file
cat > .env << EOL
GROQ_API_KEY=your_groq_api_key_here
EOL

text

### Step 5: Add Sea Level Data

Ensure `sealevel.csv` is present in either:
- `backend/public/sealevel.csv`
- `ml_backend/sealevel.csv`
- `public/sealevel.csv`

The ML server will automatically search multiple locations.

---

## ⚙️ Configuration

### Environment Variables

#### Frontend (.env) - Optional

VITE_API_URL=http://localhost:8800

text

#### Backend (.env) - Required

PORT=8800
MONGODB_URI=mongodb://localhost:27017/glaciertide
JWT_SECRET=your_secure_random_string_min_32_chars
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
VERIFICATION_EMAIL=noreply@glaciertide.com
NODE_ENV=development

text

#### ML Backend (.env) - Required

GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
FLASK_ENV=development

text

### Allowed CORS Origins

Edit `backend/server.js` to add your frontend URLs:

const allowedOrigins = [
'http://localhost:5173',
'http://localhost:5174',
'https://yourdomain.com'
];

text

---

## 🎮 Usage

### Development Mode

Open **three separate terminals**:

**Terminal 1: Frontend**
npm run dev

Runs on http://localhost:5173
text

**Terminal 2: Backend**
cd backend
npm start

Runs on http://localhost:8800
text

**Terminal 3: ML Server**
cd ml_backend
source venv/bin/activate
python ml_server.py

Runs on http://localhost:5000
text

### Production Build

Frontend
npm run build
npm run preview

Backend
cd backend
NODE_ENV=production node server.js

ML Server
cd ml_backend
FLASK_ENV=production python ml_server.py

text

### Using the Application

1. **Sign Up**: Create an account at `/signup` and verify your email
2. **Explore Globe**: Navigate to the Globe page for 3D Earth visualization
3. **View World Map**: Explore the 2D interactive map with clustered sea level data
4. **Get Predictions**: 
   - Go to Prediction Tool
   - Select a sea region (e.g., "Philippine Sea")
   - Choose a prediction model
   - Set a timeframe (10-75 years)
   - View detailed charts and analysis
5. **Chat with AI**: 
   - Click the blue AI chat button (bottom right)
   - Ask questions like:
     - "What's the sea level prediction for Philippine Sea in 2030?"
     - "Compare Arabian Sea and Caribbean Sea risks"
     - "Which seas have the highest risk?"
     - "What about 2040 for the same sea?" (context memory!)

---

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`

Create a new user account.

**Request Body:**
{
"username": "john_doe",
"email": "john@example.com",
"password": "SecurePass123!"
}

text

**Response:**
{
"message": "User registered. Please verify your email.",
"userId": "507f1f77bcf86cd799439011"
}

text

#### POST `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
{
"email": "john@example.com",
"password": "SecurePass123!"
}

text

**Response:**
{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "507f1f77bcf86cd799439011",
"username": "john_doe",
"email": "john@example.com"
}
}

text

#### GET `/api/auth/verify-email?token=xxxxx`

Verify user email address.

**Response:**
{
"message": "Email verified successfully"
}

text

---

### ML Prediction Endpoints

#### GET `/api/ml/predict/:seaName/:year`

Get sea level predictions for a specific sea and year.

**Parameters:**
- `seaName`: One of `Arabian Sea`, `Caribbean Sea`, `Philippine Sea`, `Coral Sea`, `Labrador Sea`, `Barents Sea`
- `year`: Target year (2020-2100)

**Example Request:**
GET /api/ml/predict/Philippine%20Sea/2030

text

**Response:**
{
"years": [2015, 2016, 2017, ..., 2030],
"linear": [45.2, 48.5, 51.8, ..., 267.4],
"decision_tree": [46.1, 49.2, 52.3, ..., 265.8],
"random_forest": [45.8, 48.9, 52.1, ..., 266.9],
"xgboost": [45.5, 48.7, 51.9, ..., 268.2]
}

text

---

### AI Agent Endpoints

#### POST `/api/agent/query`

Send a natural language query to the AI agent.

**Request Body:**
{
"query": "What's the sea level prediction for Philippine Sea in 2030?"
}

text

**Response:**
{
"response": "The average predicted sea level rise for the Philippine Sea by 2030 is 267.45mm.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n🎯 RISK ASSESSMENT\n🔴 CRITICAL RISK - Water rising about the height of a dining table leg (267.5mm)\n\n👥 HUMAN IMPACT\nAround 3,750,000 people and Major ports, airports, and hospitals could face regular flooding impacts\n\n⚡ RECOMMENDED ACTION\n🚨 Begin immediate adaptation planning - consider sea walls, building elevation, or managed retreat options by 2028\n\n🌊 EXPERT INSIGHT\nThe Philippine Sea is entering a critical acceleration phase—like watching a slow-motion avalanche that's picking up speed. The window for adaptation is narrowing.",
"status": "success",
"timestamp": "2025-10-10T14:30:00.000Z",
"powered_by": "Groq AI + Risk Intelligence + Context Memory"
}

text

#### GET `/api/agent/status`

Check agent availability and capabilities.

**Response:**
{
"agent_available": true,
"supported_seas": ["Arabian Sea", "Caribbean Sea", "Philippine Sea", "Coral Sea", "Labrador Sea", "Barents Sea"],
"available_models": ["linear", "decision_tree", "random_forest", "xgboost"],
"ai_provider": "Groq + Risk Intelligence + Context Memory + Production Error Handling",
"csv_data_found": true,
"features": [
"Human-friendly sea level predictions",
"Risk assessment with visual analogies",
"Population impact estimates",
"Actionable recommendations",
"Compelling narrative insights",
"Sea comparison analysis",
"Global trend overview",
"Context memory for follow-up questions",
"Production-grade error handling",
"Strict input validation"
]
}

text

#### GET `/api/agent/suggestions`

Get example queries for the AI agent.

**Response:**
{
"suggestions": [
"What's the sea level prediction for Philippine Sea in 2030?",
"Compare Arabian Sea and Caribbean Sea risk levels",
"Which seas have the highest risk of sea level rise?",
"Tell me about Barents Sea characteristics in 2035",
"What about 2070 for the same sea?",
"Show me predictions for Coral Sea by 2040"
]
}

text

#### GET `/api/debug/context`

Debug endpoint to check conversation context (development only).

**Response:**
{
"last_sea": "Philippine Sea",
"last_year": 2030,
"query_history": ["Philippine Sea 2030", "Philippine Sea 2040"]
}

text

---

## 🤖 Machine Learning Models

### Trained Models

GlacierTide uses an ensemble of 4 ML algorithms trained on 30 years of satellite altimeter data (1993-2022):

| Model | Algorithm | Purpose | Strengths |
|-------|-----------|---------|-----------|
| **Linear Regression** | Ordinary Least Squares | Baseline trend | Simple, interpretable long-term trends |
| **Decision Tree** | CART Regressor (max_depth=5) | Non-linear patterns | Captures sudden shifts and thresholds |
| **Random Forest** | Ensemble of 100 trees | Robust predictions | Reduces overfitting, handles variability |
| **XGBoost** | Gradient Boosting (100 estimators) | High accuracy | Best performance on complex patterns |

### Regional Adaptation Parameters

Each sea has unique characteristics affecting predictions:

sea_regions = {
'Philippine Sea': {
'multiplier': 2.05, # Highest risk (2x global average)
'variability': 0.25, # High seasonal variation
'acceleration': 1.1, # Rapid acceleration factor
'description': 'Highest risk area due to thermal expansion and regional warming'
},
'Arabian Sea': {
'multiplier': 1.0, # Global average
'variability': 0.15, # Moderate monsoon effects
'acceleration': 1.05,
'description': 'Moderate sea level rise with seasonal variations due to monsoons'
},
'Barents Sea': {
'multiplier': 1.2, # High risk
'variability': 0.35, # Very high seasonal variation
'acceleration': 1.15, # Arctic amplification
'description': 'Arctic warming effects with high seasonal variability'
},
'Coral Sea': {
'multiplier': 1.1,
'variability': 0.18,
'acceleration': 1.08,
'description': 'Moderate to high risk with coral reef ecosystem impacts'
},
'Caribbean Sea': {
'multiplier': 0.85, # Lower than global average
'variability': 0.2,
'acceleration': 1.0,
'description': 'Lower than global average due to ocean circulation patterns'
},
'Labrador Sea': {
'multiplier': 0.85,
'variability': 0.3,
'acceleration': 0.95,
'description': 'Lower rise due to glacial isostatic adjustment'
}
}

text

### Prediction Process

1. **Data Loading**: Historical GMSL (Global Mean Sea Level) data from CSV
2. **Baseline Calculation**: 1993 baseline established (all predictions relative to this)
3. **Model Training**: All 4 models fit on Year → SeaLevelRise relationship
4. **Regional Adjustment**: Predictions multiplied by sea-specific factors
5. **Acceleration Modeling**: Non-linear acceleration applied for future years
6. **Variability Injection**: Sinusoidal patterns added for realistic fluctuations
7. **Ensemble Averaging**: Final prediction averages all 4 models

### Risk Classification Logic

The Risk Intelligence Engine uses a multi-tier classification system:

def classify_risk_level(multiplier):
if multiplier > 1.5:
return "🔴 CRITICAL RISK"
elif multiplier > 1.2:
return "🟠 HIGH RISK"
elif multiplier > 0.9:
return "🟡 MODERATE RISK"
else:
return "🟢 LOWER RISK"

text

### Human Impact Estimation

Population impact calculations based on coastal population density:

population_estimates = {
'Philippine Sea': 15000000, # 15M people in coastal zones
'Arabian Sea': 8000000,
'Caribbean Sea': 5000000,
'Coral Sea': 2000000,
'Barents Sea': 500000,
'Labrador Sea': 300000
}

text

Affected population calculated as:
affected_people = base_population × risk_factor × affected_ratio

text

Where `affected_ratio` ranges from 3% (low risk) to 25% (critical risk).

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
git checkout -b feature/amazing-feature

text
3. **Make your changes**
- Follow existing code style
- Add tests if applicable
- Update documentation
4. **Commit your changes**
git commit -m "Add amazing feature: detailed description"

text
5. **Push to your fork**
git push origin feature/amazing-feature

text
6. **Open a Pull Request**
- Describe your changes clearly
- Reference any related issues
- Include screenshots for UI changes

### Areas for Contribution

#### 🌊 Data & Science
- **Additional Sea Regions**: Expand monitoring to Mediterranean, Baltic, North Sea, etc.
- **Climate Data Integration**: Incorporate temperature, ice melt, ocean currents
- **Model Improvements**: LSTM, GRU, Transformer-based time series models

#### 🧠 AI & ML
- **Advanced Agents**: Multi-agent systems for comprehensive climate analysis
- **Fine-tuned Models**: Domain-specific LLMs for climate science
- **Sentiment Analysis**: Analyze climate policy documents and public perception

#### 📊 Visualization
- **New Chart Types**: Heatmaps, radar charts, animated time-lapses
- **AR/VR Support**: Immersive 3D visualizations
- **Dashboard Customization**: User-created widgets and layouts

#### 🌐 Platform Features
- **Internationalization**: Translate UI to Spanish, French, Chinese, Hindi, etc.
- **Mobile App**: React Native version for iOS/Android
- **Data Export**: PDF reports, CSV downloads, API integrations
- **Social Sharing**: Share predictions on social media with visualizations

#### 🧪 Testing & Quality
- **Unit Tests**: Jest for React, Pytest for Flask
- **Integration Tests**: End-to-end testing with Playwright/Cypress
- **Performance**: Load testing, optimization, caching strategies

#### 📚 Documentation
- **Video Tutorials**: YouTube tutorials for setup and usage
- **API Documentation**: Swagger/OpenAPI specifications
- **Deployment Guides**: Docker, Kubernetes, AWS, Azure, GCP

### Code Style Guidelines

#### Frontend (React/JavaScript)
- ESLint configuration with React best practices
- Functional components with hooks (no class components)
- TailwindCSS for styling (avoid inline styles)
- Meaningful component and variable names

#### Backend (Node.js)
- Airbnb JavaScript style guide
- Async/await over callbacks
- Proper error handling with try-catch
- Input validation and sanitization

#### ML Backend (Python)
- PEP 8 style guide
- Type hints for function signatures
- Docstrings for all functions and classes
- Virtual environments for dependency isolation

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: ML Server Won't Start
Error: "Agent dependencies not available"
Solution: Install all Python dependencies
pip install langchain langchain-groq flask flask-cors pandas numpy scikit-learn xgboost

text

#### Issue: CORS Errors in Browser
// Solution: Add your frontend URL to backend/server.js
const allowedOrigins = ['http://localhost:5173'];

text

#### Issue: Groq API Rate Limiting
Error: "Rate limit exceeded"
Solution: The free tier has limits. Consider:
1. Adding delays between requests
2. Implementing request caching
3. Upgrading to paid tier
text

#### Issue: MongoDB Connection Failed
Solution: Ensure MongoDB is running
For local MongoDB:
sudo systemctl start mongodb

For MongoDB Atlas:
Check connection string in .env file
text

#### Issue: Email Verification Not Working
Check SendGrid API key is valid
Verify sender email is authenticated in SendGrid
Check spam folder for verification emails
text

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

MIT License

Copyright (c) 2025 GlacierTide

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

text

---

## 🙏 Acknowledgments

### Data Sources
- **NASA/NOAA**: Satellite altimeter measurements (1993-2022)
- **GMSL Dataset**: Global Mean Sea Level with Glacial Isostatic Adjustment (GIA)
- **IPCC Reports**: Sea level rise projections and regional variations

### AI & Infrastructure
- **[Groq](https://groq.com/)**: Ultra-fast LLM inference with Gemma2-9B
- **[LangChain](https://langchain.com/)**: Agent orchestration and tool integration
- **[Hugging Face](https://huggingface.co/)**: ML model resources and community

### Inspiration & Research
- **WMO Climate Monitoring Dashboards**: Global climate data visualization standards
- **Research Papers**: 
  - "Sea level Projections with Machine Learning" (arXiv:2308.02460)
  - "Leveraging synthetic data to improve regional sea level predictions" (Nature 2025)
  - "Predicting sea levels using ML algorithms in selected regions" (PMC)

### Open Source Community
- **React Team**: For React 19 and excellent documentation
- **Vite Team**: For the fastest build tool in the ecosystem
- **TailwindCSS**: For the utility-first CSS framework
- **Three.js Community**: For 3D visualization capabilities
- **Flask & Python**: For robust ML backend infrastructure

---

## 🌟 Star History

If you find GlacierTide useful, please consider giving it a ⭐ on GitHub!

---

## 📞 Contact & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/glaciertide/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/yourusername/glaciertide/discussions)
- **Email**: support@glaciertide.com
- **Twitter**: [@GlacierTide](https://twitter.com/glaciertide)
- **Discord**: [Join our community](https://discord.gg/glaciertide)

---

## 🗺️ Roadmap

### Version 1.1 (Q1 2026)
- [ ] Additional sea regions (Mediterranean, Baltic, North Sea)
- [ ] Downloadable PDF reports
- [ ] Email alerts for high-risk predictions
- [ ] Multi-language support (ES, FR, ZH)

### Version 1.2 (Q2 2026)
- [ ] Mobile app (React Native)
- [ ] Advanced climate data integration (temperature, ice melt)
- [ ] User-created prediction scenarios
- [ ] Social media sharing with auto-generated visualizations

### Version 2.0 (Q3 2026)
- [ ] Deep learning models (LSTM, Transformers)
- [ ] Real-time satellite data integration
- [ ] AR/VR immersive visualizations
- [ ] Public API for researchers

---

<div align="center">

**Built with ❤️ for climate awareness and ocean conservation**

⭐ **Star this repo** if you find it useful!

[Report Bug](https://github.com/yourusername/glaciertide/issues) • [Request Feature](https://github.com/yourusername/glaciertide/issues) • [Documentation](https://github.com/yourusername/glaciertide/wiki)

</div>