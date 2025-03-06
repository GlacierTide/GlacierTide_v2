import { useState } from 'react';
import { Layout } from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Info, MapPin, BarChart2 } from 'lucide-react';

// Sample data for the chart
const sampleData = [
  { year: 2000, mass: 100, area: 95 },
  { year: 2005, mass: 92, area: 90 },
  { year: 2010, mass: 87, area: 86 },
  { year: 2015, mass: 80, area: 82 },
  { year: 2020, mass: 75, area: 77 },
  { year: 2025, mass: 68, area: 71, predicted: true },
  { year: 2030, mass: 60, area: 64, predicted: true },
  { year: 2035, mass: 53, area: 58, predicted: true },
  { year: 2040, mass: 45, area: 51, predicted: true },
  { year: 2045, mass: 38, area: 45, predicted: true },
  { year: 2050, mass: 30, area: 38, predicted: true },
];

const PredictionTool = () => {
  const [selectedRegion, setSelectedRegion] = useState('alps');
  const [timeframe, setTimeframe] = useState('50');

  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="relative py-20 bg-ice-50">
          <div className="absolute inset-0 bg-glacier-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Glacier Prediction Tool</h1>
              <p className="text-lg text-gray-500">
                Visualize and predict glacier changes over time with our advanced modeling system.
              </p>
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
                      <label htmlFor="region" className="block text-gray-600 mb-2 font-medium">
                        <MapPin className="inline-block h-4 w-4 mr-2" />
                        Select Region
                      </label>
                      <select 
                        id="region" 
                        value={selectedRegion} 
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="glacier-input w-full"
                      >
                        <option value="alps">European Alps</option>
                        <option value="himalayas">Himalayas</option>
                        <option value="andes">Andes Mountains</option>
                        <option value="alaska">Alaska Range</option>
                        <option value="greenland">Greenland Ice Sheet</option>
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
                        This prediction tool uses historical data and climate models to forecast glacier changes. Results show estimated mass and surface area changes over time based on current climate trends.
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="inline-block w-3 h-3 bg-glacier-600 rounded-full"></span>
                      <span className="text-sm text-gray-600">Glacier Mass Index</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="inline-block w-3 h-3 bg-glacier-400 rounded-full"></span>
                      <span className="text-sm text-gray-600">Surface Area Index</span>
                    </div>
                    <div className="text-sm text-gray-500 italic">
                      Note: Dotted lines represent predicted future values.
                    </div>
                  </div>
                </div>
                
                {/* Visualization */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-black">
                      <BarChart2 className="inline-block h-5 w-5 mr-2" />
                      Glacier Change Visualization
                    </h2>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={sampleData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="custom-tooltip bg-white p-4 shadow-lg rounded-lg border border-ice-200">
                                  <p className="font-medium text-black">Year: {label}</p>
                                  <p className="text-glacier-600">Mass Index: {data.mass}%</p>
                                  <p className="text-glacier-400">Surface Area: {data.area}%</p>
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
                          dataKey="mass" 
                          name="Glacier Mass" 
                          stroke="#0284c7" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                          strokeDasharray={d => d.predicted ? "5 5" : "0"}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="area" 
                          name="Surface Area" 
                          stroke="#38bdf8" 
                          strokeWidth={2}
                          strokeDasharray={d => d.predicted ? "5 5" : "0"}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="text-lg font-medium text-black mb-2">Analysis Summary</h3>
                    <p className="text-gray-600">
                      Based on current climate models, glaciers in the selected region are projected to lose approximately 70% of their mass and 62% of their surface area by 2050 compared to 2000 levels. This rapid decline could significantly impact water resources, ecosystems, and sea level rise.
                    </p>
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
