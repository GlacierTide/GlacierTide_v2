import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Info, MapPin, BarChart2, Filter } from 'lucide-react';

// API base URL - change this to match your Flask server
const API_BASE_URL = 'http://localhost:5000';

// Revised sea regions with multipliers
const seaRegions = {
  arabiansea: {
    id: 'arabiansea',
    name: 'Arabian Sea',
    multiplier: 1.0
  },
  caribbean: {
    id: 'caribbean',
    name: 'Caribbean Sea',
    multiplier: 0.85
  },
  philippine: {
    id: 'philippine',
    name: 'Philippine Sea',
    multiplier: 2.05
  },
  coral: {
    id: 'coral',
    name: 'Coral Sea',
    multiplier: 1.1
  },
  labrador: {
    id: 'labrador',
    name: 'Labrador Sea',
    multiplier: 0.85
  },
  barents: {
    id: 'barents',
    name: 'Barents Sea',
    multiplier: 1.2
  }
};

// Available prediction models
const predictionModels = [
  { id: 'linear', name: 'Linear Regression' },
  { id: 'decision_tree', name: 'Decision Tree' },
  { id: 'random_forest', name: 'Random Forest' },
  { id: 'xgboost', name: 'XGBoost' }
];

// Global sea level rise rate (mm/year)
const GLOBAL_SEA_RISE_RATE = 3.2;

const PredictionTool = () => {
  const [selectedSea, setSelectedSea] = useState('arabiansea');
  const [timeframe, setTimeframe] = useState('50');
  const [selectedModel, setSelectedModel] = useState('linear');
  const [predictionData, setPredictionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('unknown');

  // Check if API is available
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);
        if (response.ok) {
          setApiStatus('connected');
        } else {
          setApiStatus('error');
        }
      } catch (err) {
        setApiStatus('error');
      }
    };
    checkApiStatus();
  }, []);

  // Generate prediction data based on selected parameters
  useEffect(() => {
    const fetchPredictions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const years = parseInt(timeframe);
        const currentYear = 2025;
        const data = [];
        const finalYear = currentYear + years;
        const seaName = seaRegions[selectedSea].name;
        const seaMultiplier = seaRegions[selectedSea].multiplier;

        // Fetch prediction from API
        const response = await fetch(`${API_BASE_URL}/predict/${seaName}/${finalYear}`);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const modelPredictions = await response.json();
        if (modelPredictions.error) {
          throw new Error(modelPredictions.error);
        }

        // Get the selected model's prediction for the final year and apply multiplier
        let finalPrediction = modelPredictions[selectedModel];
        if (typeof finalPrediction !== 'number') {
          throw new Error(`Invalid prediction value: ${finalPrediction}`);
        }
        finalPrediction = finalPrediction * seaMultiplier;

        // Generate historical data (past 10 years)
        const baseRiseRate = finalPrediction / years;
        for (let i = -10; i <= 0; i++) {
          const year = currentYear + i;
          const historicalLevel = Math.round(baseRiseRate * (i + 10) * 10) / 10;
          data.push({
            year,
            seaLevel: historicalLevel,
            predicted: false
          });
        }

        // Generate prediction data with a linear interpolation to the final prediction
        for (let i = 1; i <= years; i++) {
          const year = currentYear + i;
          const seaLevel = Math.round((baseRiseRate * (i + 10)) * 10) / 10;
          data.push({
            year,
            seaLevel,
            predicted: true
          });
        }

        setPredictionData(data);
      } catch (err) {
        setError(err.message);
        generateFallbackData();
      } finally {
        setIsLoading(false);
      }
    };

    // Fallback data generator in case API fails
    const generateFallbackData = () => {
      const years = parseInt(timeframe);
      const currentYear = 2025;
      const data = [];
      const seaMultiplier = seaRegions[selectedSea].multiplier;
      const baseRiseRate = GLOBAL_SEA_RISE_RATE * seaMultiplier;
      const modelFactors = {
        linear: 1.0,
        decision_tree: 1.05,
        random_forest: 0.98,
        xgboost: 1.08
      };
      const adjustedRiseRate = baseRiseRate * modelFactors[selectedModel];
      for (let i = -10; i <= 0; i++) {
        const year = currentYear + i;
        const historicalLevel = Math.round(adjustedRiseRate * (i + 10) * 10) / 10;
        data.push({
          year,
          seaLevel: historicalLevel,
          predicted: false
        });
      }
      for (let i = 1; i <= years; i++) {
        const year = currentYear + i;
        let variability = 0;
        if (selectedModel === 'linear') {
          variability = Math.sin(i * 0.2) * 1.5;
        } else if (selectedModel === 'decision_tree') {
          variability = (i % 5 === 0) ? 2 : -1;
        } else if (selectedModel === 'random_forest') {
          variability = Math.sin(i * 0.5) * 1.2 + Math.cos(i * 0.3) * 0.8;
        } else {
          variability = Math.sin(i * 0.4) * 2;
        }
        const seaLevel = Math.round((adjustedRiseRate * (i + 10) + variability) * 10) / 10;
        data.push({
          year,
          seaLevel,
          predicted: true
        });
      }
      setPredictionData(data);
    };

    if (apiStatus === 'connected') {
      fetchPredictions();
    } else if (apiStatus === 'error') {
      generateFallbackData();
    }
  }, [selectedSea, timeframe, selectedModel, apiStatus]);

  // Calculate key statistics for the summary
  const getTotalRise = () => {
    if (predictionData.length === 0) return 0;
    const firstValue = predictionData[0].seaLevel;
    const lastValue = predictionData[predictionData.length - 1].seaLevel;
    return Math.round((lastValue - firstValue) * 10) / 10;
  };

  const getAverageRiseRate = () => {
    if (predictionData.length === 0) return 0;
    const totalRise = getTotalRise();
    const years = parseInt(timeframe) + 10;
    return Math.round((totalRise / years) * 100) / 100;
  };

  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="relative py-20 bg-ice-50">
          <div className="absolute inset-0 bg-glacier-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Sea Level Rise Prediction Tool</h1>
              <p className="text-lg text-gray-500">
                Visualize and predict sea level changes over time with our advanced modeling system.
              </p>
              {apiStatus === 'error' && (
                <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded-md inline-block">
                  Note: Using fallback data. ML server connection unavailable.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tool Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="glacier-card p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-semibold text-black mb-6">Prediction Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="sea" className="block text-gray-600 mb-2 font-medium">
                        <MapPin className="inline-block h-4 w-4 mr-2" />
                        Select Sea Region
                      </label>
                      <select
                        id="sea"
                        value={selectedSea}
                        onChange={(e) => setSelectedSea(e.target.value)}
                        className="glacier-input w-full"
                      >
                        {Object.values(seaRegions).map((sea) => (
                          <option key={sea.id} value={sea.id}>
                            {sea.name} (×{sea.multiplier} multiplier)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="model" className="block text-gray-600 mb-2 font-medium">
                        <Filter className="inline-block h-4 w-4 mr-2" />
                        Select Prediction Model
                      </label>
                      <select
                        id="model"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="glacier-input w-full"
                      >
                        {predictionModels.map((model) => (
                          <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="timeframe" className="block text-gray-600 mb-2 font-medium">
                        <Calendar className="inline-block h-4 w-4 mr-2" />
                        Prediction Timeframe (Years)
                      </label>
                      <select
                        id="timeframe"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="glacier-input w-full"
                      >
                        <option value="10">10 Years</option>
                        <option value="25">25 Years</option>
                        <option value="50">50 Years</option>
                        <option value="100">100 Years</option>
                      </select>
                    </div>
                    <div className="bg-glacier-50 p-4 rounded-lg border border-glacier-100">
                      <div className="flex items-start mb-2">
                        <Info className="h-5 w-5 text-glacier-700 mr-2 flex-shrink-0 mt-0.5" />
                        <h3 className="text-lg font-medium text-black">About This Tool</h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        This prediction tool uses trained machine learning models to forecast sea level changes. Results show estimated sea level rise in millimeters over time based on the selected model and regional factors. Each sea has a specific multiplier applied to the global sea level rise rate of {GLOBAL_SEA_RISE_RATE} mm/year.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Visualization */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-black">
                      <BarChart2 className="inline-block h-5 w-5 mr-2" />
                      Sea Level Rise Projection
                    </h2>
                  </div>
                  <div className="bg-white rounded-lg p-4 h-[400px]">
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="animate-pulse text-center">
                          <div className="h-4 bg-blue-200 rounded w-32 mx-auto mb-2"></div>
                          <div className="h-2 bg-blue-100 rounded w-24 mx-auto"></div>
                        </div>
                      </div>
                    ) : error && apiStatus === 'connected' ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center text-red-500">
                          <p>Error loading predictions: {error}</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={predictionData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="year"
                            label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }}
                          />
                          <YAxis
                            label={{ value: 'Sea Level Rise (mm)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="custom-tooltip bg-white p-4 shadow-lg rounded-lg border border-ice-200">
                                    <p className="font-medium text-black">Year: {label}</p>
                                    <p className="text-blue-600">Sea Level: {data.seaLevel} mm</p>
                                    {data.predicted && (
                                      <p className="text-xs text-ice-500 mt-1">Predicted Value</p>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="seaLevel"
                            name="Sea Level Rise"
                            stroke="#0284c7"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                            strokeDasharray={d => d.predicted ? "5 5" : "0"}
                            dot={{ strokeWidth: 2, r: 4, fill: "#fff" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="mt-6 p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="text-lg font-medium text-black mb-2">Analysis Summary</h3>
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-4 bg-blue-100 rounded w-full mb-2"></div>
                        <div className="h-4 bg-blue-100 rounded w-5/6"></div>
                      </div>
                    ) : error && apiStatus === 'connected' ? (
                      <p className="text-red-500">Unable to generate analysis due to error.</p>
                    ) : (
                      <p className="text-gray-600">
                        Based on the {predictionModels.find(m => m.id === selectedModel)?.name} model, sea levels in the {seaRegions[selectedSea]?.name} are projected to rise by approximately {getTotalRise()} mm over the next {parseInt(timeframe) + 10} years, with an average rate of {getAverageRiseRate()} mm per year. This represents a {seaRegions[selectedSea]?.multiplier}× multiplier on the global average sea level rise rate. This rise could impact coastal communities, infrastructure, and ecosystems in the region.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default PredictionTool;
