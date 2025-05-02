import { useState, useEffect } from 'react';

function Popup({ seaName, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mlData, setMlData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('predictions');
  const [selectedModel, setSelectedModel] = useState('');
  const [seaSpecificData, setSeaSpecificData] = useState(null);

  // Constants from PredictionTool.jsx
  const GLOBAL_SEA_RISE_RATE = 3.2; // mm/year
  
  // Sea regions with multipliers from PredictionTool.jsx
  const seaRegions = {
    'Arabian Sea': {
      id: 'arabiansea',
      name: 'Arabian Sea',
      multiplier: 1.0
    },
    'Caribbean Sea': {
      id: 'caribbean',
      name: 'Caribbean Sea',
      multiplier: 0.85
    },
    'Philippine Sea': {
      id: 'philippine',
      name: 'Philippine Sea',
      multiplier: 2.05
    },
    'Coral Sea': {
      id: 'coral',
      name: 'Coral Sea',
      multiplier: 1.1
    },
    'Labrador Sea': {
      id: 'labrador',
      name: 'Labrador Sea',
      multiplier: 0.85
    },
    'Barents Sea': {
      id: 'barents',
      name: 'Barents Sea',
      multiplier: 1.2
    }
  };

  // Available prediction models from PredictionTool.jsx
  const predictionModels = [
    { id: 'linear', name: 'Linear Regression' },
    { id: 'decision_tree', name: 'Decision Tree' },
    { id: 'random_forest', name: 'Random Forest' },
    { id: 'xgboost', name: 'XGBoost' }
  ];

  useEffect(() => {
    setIsVisible(true);
    fetchMLData();
    setSeaSpecificData(getSeaSpecificData(seaName));

    const handleEscape = (e) => e.key === 'Escape' && handleCloseClick();
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [seaName]);

  const fetchMLData = async () => {
    setIsLoading(true);
    try {
      const futureYear = new Date().getFullYear() + 20; // Predict 20 years ahead
      const response = await fetch(`/api/ml/predict/${encodeURIComponent(seaName)}/${futureYear}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Filter out the 'years' option from the data
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== 'years')
      );
      
      setMlData(filteredData);
      
      // Set the first model as default selected model
      if (filteredData && !filteredData.error && Object.keys(filteredData).length > 0) {
        setSelectedModel(Object.keys(filteredData)[0]);
      }
    } catch (error) {
      console.error('Error fetching ML data:', error);
      setMlData({ error: 'Failed to load ML predictions' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseClick = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  // Helper function to safely format prediction values
  const formatPredictionValue = (value) => {
    // Check if value is a valid number
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return "N/A"; // Return "N/A" if not a valid number
    }
    return numValue.toFixed(3) + " mm"; // Format to 3 decimal places
  };

  const getSeaSpecificData = (sea) => {
    const region = Object.values(seaRegions).find(r => r.name === sea);
    const multiplier = region ? region.multiplier : 1.0;
    const riseRate = (GLOBAL_SEA_RISE_RATE * multiplier).toFixed(1);
    const projectedRise = ((GLOBAL_SEA_RISE_RATE * multiplier * 75) / 1000).toFixed(2); // 75 years to 2100

    const seaData = {
      'Arabian Sea': {
        impact: {
          title: 'Arabian Sea Impact Analysis',
          riseRate: `${riseRate} mm/year`,
          projectedRise: `${projectedRise} meters by 2100`,
          impacts: [
            {
              icon: 'warning',
              title: 'Coastal Flooding',
              description: 'Major coastal cities like Mumbai could experience annual flooding by 2050, affecting millions of residents and critical infrastructure.'
            },
            {
              icon: 'infrastructure',
              title: 'Infrastructure Risk',
              description: 'Ports, coastal roads, and urban centers along the western Indian coastline face substantial damage from rising sea levels.'
            },
            {
              icon: 'ecosystem',
              title: 'Marine Heatwaves',
              description: 'Increasing frequency of marine heatwaves threatening coral reefs and fisheries that support local economies.'
            }
          ]
        },
        mitigation: {
          strategies: [
            {
              icon: 'shield',
              title: 'Coastal Defense Systems',
              description: 'Implementation of seawalls and breakwaters to protect densely populated urban areas like Mumbai and Karachi.'
            },
            {
              icon: 'alert',
              title: 'Managed Retreat',
              description: 'Relocation planning for vulnerable coastal communities in Gujarat and Maharashtra regions.'
            },
            {
              icon: 'nature',
              title: 'Mangrove Restoration',
              description: 'Expanding mangrove forests along the coastline to act as natural buffers against storm surges and erosion.'
            }
          ]
        }
      },
      'Coral Sea': {
        impact: {
          title: 'Coral Sea Impact Analysis',
          riseRate: `${riseRate} mm/year`,
          projectedRise: `${projectedRise} meters by 2100`,
          impacts: [
            {
              icon: 'warning',
              title: 'Reef Degradation',
              description: 'The Great Barrier Reef faces severe bleaching events and degradation due to rising sea temperatures and changing ocean chemistry.'
            },
            {
              icon: 'infrastructure',
              title: 'Coastal Tourism Impact',
              description: 'Multi-billion dollar tourism industry threatened by reef degradation and increased storm activity along Queensland coast.'
            },
            {
              icon: 'ecosystem',
              title: 'Marine Biodiversity Loss',
              description: 'Critical habitat for thousands of marine species at risk, with cascading effects throughout the marine food web.'
            }
          ]
        },
        mitigation: {
          strategies: [
            {
              icon: 'shield',
              title: 'Reef Restoration Programs',
              description: 'Large-scale coral propagation and transplantation efforts to rebuild damaged reef systems and enhance resilience.'
            },
            {
              icon: 'alert',
              title: 'Water Quality Improvement',
              description: 'Reducing agricultural runoff and improving coastal water quality to minimize additional stressors on reef ecosystems.'
            },
            {
              icon: 'nature',
              title: 'Marine Protected Areas',
              description: 'Expanding and strengthening the network of marine protected areas to provide refuge for vulnerable species.'
            }
          ]
        }
      },
      'Philippine Sea': {
        impact: {
          title: 'Philippine Sea Impact Analysis',
          riseRate: `${riseRate} mm/year`,
          projectedRise: `${projectedRise} meters by 2100`,
          impacts: [
            {
              icon: 'warning',
              title: 'Island Vulnerability',
              description: 'Many low-lying islands in the Philippine archipelago face partial or complete submersion with continued sea level rise.'
            },
            {
              icon: 'infrastructure',
              title: 'Urban Flooding',
              description: 'Major coastal cities like Manila experiencing increased flooding frequency, with over 13 million people at elevated risk.'
            },
            {
              icon: 'ecosystem',
              title: 'Mangrove Migration',
              description: 'Coastal mangrove ecosystems unable to migrate inland due to urban development, leading to habitat loss.'
            }
          ]
        },
        mitigation: {
          strategies: [
            {
              icon: 'shield',
              title: 'Typhoon-Resistant Infrastructure',
              description: 'Developing and implementing building codes that account for increased storm intensity and sea level rise.'
            },
            {
              icon: 'alert',
              title: 'Early Warning Systems',
              description: 'Enhanced monitoring and communication networks to provide timely alerts for extreme weather events.'
            },
            {
              icon: 'nature',
              title: 'Coastal Ecosystem Restoration',
              description: 'Rehabilitating mangroves, seagrass beds, and coral reefs to provide natural coastal protection.'
            }
          ]
        }
      },
      'Barents Sea': {
        impact: {
          title: 'Barents Sea Impact Analysis',
          riseRate: `${riseRate} mm/year`,
          projectedRise: `${projectedRise} meters by 2100`,
          impacts: [
            {
              icon: 'warning',
              title: 'Arctic Amplification',
              description: 'Warming at twice the global average rate, leading to accelerated ice loss and changing ocean circulation patterns.'
            },
            {
              icon: 'infrastructure',
              title: 'Shipping Route Changes',
              description: 'Opening of new shipping routes as sea ice retreats, creating both economic opportunities and environmental risks.'
            },
            {
              icon: 'ecosystem',
              title: 'Ecosystem Shifts',
              description: 'Boreal species moving northward, disrupting the Arctic food web and affecting indigenous communities.'
            }
          ]
        },
        mitigation: {
          strategies: [
            {
              icon: 'shield',
              title: 'International Cooperation',
              description: 'Strengthening Arctic Council governance to manage new shipping routes and resource extraction sustainably.'
            },
            {
              icon: 'alert',
              title: 'Climate Monitoring',
              description: 'Expanding the network of monitoring stations to track changes in sea ice, ocean temperature, and marine ecosystems.'
            },
            {
              icon: 'nature',
              title: 'Protected Marine Areas',
              description: 'Establishing marine protected areas in newly ice-free regions before commercial exploitation begins.'
            }
          ]
        }
      },
      'Caribbean Sea': {
        impact: {
          title: 'Caribbean Sea Impact Analysis',
          riseRate: `${riseRate} mm/year`,
          projectedRise: `${projectedRise} meters by 2100`,
          impacts: [
            {
              icon: 'warning',
              title: 'Island Vulnerability',
              description: 'Small island nations face existential threats from rising sea levels, with potential displacement of coastal populations.'
            },
            {
              icon: 'infrastructure',
              title: 'Critical Infrastructure Loss',
              description: 'Water treatment works, aquifers, oil refineries, power stations and tourism infrastructure at severe risk from inundation.'
            },
            {
              icon: 'ecosystem',
              title: 'Compounding Hazards',
              description: 'Short-term events like hurricanes reduce resilience to long-term sea level changes, creating cascading impacts across economies.'
            }
          ]
        },
        mitigation: {
          strategies: [
            {
              icon: 'shield',
              title: 'Early Adaptation Planning',
              description: 'Commence coastal protection planning within the next 15 years to complete necessary infrastructure by mid-century.'
            },
            {
              icon: 'alert',
              title: 'Insurance Policy Reform',
              description: 'Integrate SLR into government insurance policies to enable landowners to properly assess coastal protection and retreat options.'
            },
            {
              icon: 'nature',
              title: 'Coordinated Retreat Framework',
              description: 'Review and develop policies and legal frameworks to support coordinated retreat from high-risk coastal areas.'
            }
          ]
        }
      },
      'Labrador Sea': {
        impact: {
          title: 'Labrador Sea Impact Analysis',
          riseRate: `${riseRate} mm/year`,
          projectedRise: `${projectedRise} meters by 2100`,
          impacts: [
            {
              icon: 'warning',
              title: 'Thermohaline Circulation',
              description: 'Changes in deep water formation affecting the Atlantic Meridional Overturning Circulation, with potential global climate impacts.'
            },
            {
              icon: 'infrastructure',
              title: 'Coastal Communities',
              description: 'Remote coastal communities in Labrador and Greenland facing increased erosion and infrastructure damage from storm surges.'
            },
            {
              icon: 'ecosystem',
              title: 'Marine Mammal Habitat',
              description: 'Critical habitat for whales, seals, and polar bears disrupted by changing sea ice patterns and ocean temperatures.'
            }
          ]
        },
        mitigation: {
          strategies: [
            {
              icon: 'shield',
              title: 'Climate Monitoring',
              description: 'Enhanced monitoring of ocean circulation patterns and deep water formation to improve climate models.'
            },
            {
              icon: 'alert',
              title: 'Indigenous Knowledge',
              description: 'Incorporating traditional ecological knowledge from Inuit and other indigenous communities into adaptation planning.'
            },
            {
              icon: 'nature',
              title: 'Sustainable Fisheries',
              description: 'Implementing adaptive fisheries management to respond to shifting species distributions and changing ecosystem dynamics.'
            }
          ]
        }
      },
      'default': {
        impact: {
          title: 'Potential Impact Analysis',
          riseRate: `${GLOBAL_SEA_RISE_RATE} mm/year`,
          projectedRise: 'Variable by region',
          impacts: [
            {
              icon: 'warning',
              title: 'Coastal Erosion',
              description: 'Accelerated erosion patterns in coastal areas.'
            },
            {
              icon: 'infrastructure',
              title: 'Infrastructure',
              description: 'Potential risk to low-lying coastal infrastructure.'
            },
            {
              icon: 'ecosystem',
              title: 'Ecosystem',
              description: 'Changes to coastal ecosystems and biodiversity.'
            }
          ]
        },
        mitigation: {
          strategies: [
            {
              icon: 'shield',
              title: 'Coastal Defenses',
              description: 'Natural and engineered solutions to protect shorelines.'
            },
            {
              icon: 'alert',
              title: 'Early Warning Systems',
              description: 'Monitoring and alert systems for storm surges and flooding events.'
            },
            {
              icon: 'nature',
              title: 'Ecosystem Protection',
              description: 'Conservation of natural coastal barriers like reefs and wetlands.'
            }
          ]
        }
      }
    };

    return seaData[sea] || seaData['default'];
  };

  const renderLoadingSkeleton = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-blue-200 rounded w-3/4"></div>
      <div className="h-4 bg-blue-200 rounded w-1/2"></div>
      <div className="h-4 bg-blue-200 rounded w-2/3"></div>
      <div className="h-4 bg-blue-200 rounded w-1/2"></div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'predictions') {
      return (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <h3 className="text-blue-800 font-medium mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              ML Predictions (20 Years)
            </h3>
            
            {isLoading ? renderLoadingSkeleton() : (
              <>
                {mlData && !mlData.error ? (
                  <div className="space-y-3">
                    <div className="mb-4">
                      <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-1">
                        Select Prediction Model:
                      </label>
                      <select
                        id="model-select"
                        value={selectedModel}
                        onChange={handleModelChange}
                        className="w-full p-2 border border-blue-300 rounded-md bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-800"
                      >
                        {predictionModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {selectedModel && (
                      <div className="bg-blue-100 p-4 rounded-md flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                          <span className="text-gray-700 font-medium">{predictionModels.find(m => m.id === selectedModel)?.name}:</span>
                        </div>
                        <span className="text-blue-900 font-bold text-lg">
                          {formatPredictionValue(mlData[selectedModel])}
                        </span>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mt-4">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>This prediction shows estimated sea level change for {seaName} over the next 20 years based on the selected climate model. The global sea level rise rate is {GLOBAL_SEA_RISE_RATE} mm/year with a regional multiplier of {seaRegions[seaName]?.multiplier || 1.0}x.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-md text-red-700 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {mlData?.error || "Unable to load prediction data"}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <h3 className="text-blue-800 font-medium mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Historical Trends
            </h3>
            <p className="text-gray-600 text-sm">
              Average sea level rise over the past decade: <span className="font-semibold text-blue-700">{seaSpecificData?.impact.riseRate || `${GLOBAL_SEA_RISE_RATE} mm/year`}</span>
            </p>
          </div>
        </div>
      );
    } else if (activeTab === 'impact') {
      return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <h3 className="text-blue-800 font-medium mb-3">{seaSpecificData?.impact.title || 'Potential Impact Analysis'}</h3>
          <div className="mb-3 text-sm text-gray-600">
            <p>Projected rise: <span className="font-semibold text-blue-700">{seaSpecificData?.impact.projectedRise || 'Variable by region'}</span></p>
          </div>
          <ul className="space-y-3">
            {seaSpecificData?.impact.impacts.map((impact, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`${impact.icon === 'warning' ? 'bg-yellow-100' : impact.icon === 'infrastructure' ? 'bg-blue-100' : 'bg-green-100'} p-1 rounded-full`}>
                  <svg className={`w-4 h-4 ${impact.icon === 'warning' ? 'text-yellow-600' : impact.icon === 'infrastructure' ? 'text-blue-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {impact.icon === 'warning' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    ) : impact.icon === 'infrastructure' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    )}
                  </svg>
                </div>
                <div>
                  <span className="font-medium">{impact.title}:</span> {impact.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <h3 className="text-blue-800 font-medium mb-3">Mitigation Strategies for {seaName}</h3>
          <div className="space-y-3">
            {seaSpecificData?.mitigation.strategies.map((strategy, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {strategy.icon === 'shield' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  ) : strategy.icon === 'alert' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <div>
                  <span className="font-medium block">{strategy.title}:</span>
                  <p className="text-sm text-gray-600">{strategy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-900/50 backdrop-blur-sm z-40 flex items-center justify-center transition-opacity duration-300 ease-in-out"
         style={{ opacity: isVisible ? 1 : 0 }}>
      <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-2xl max-w-lg w-11/12 transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} border border-blue-200 overflow-hidden`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 p-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 50C20 30 40 45 60 50C80 55 100 35 120 50C140 65 160 50 180 40C200 30 220 45 240 60" 
                    stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-white" />
            </svg>
          </div>
          
          <div className="flex justify-between items-center relative z-10">
            <h2 className="text-xl font-bold tracking-wide text-white flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              {seaName}
            </h2>
            <button 
              onClick={handleCloseClick}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-blue-500/30 transition-colors"
              aria-label="Close popup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-blue-100/50 border-b border-blue-200 flex">
          <button 
            className={`py-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'predictions' ? 'text-blue-700' : 'text-blue-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('predictions')}
          >
            Predictions
            {activeTab === 'predictions' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button 
            className={`py-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'impact' ? 'text-blue-700' : 'text-blue-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('impact')}
          >
            Impact
            {activeTab === 'impact' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button 
            className={`py-3 px-4 text-sm font-medium transition-colors relative ${activeTab === 'mitigation' ? 'text-blue-700' : 'text-blue-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('mitigation')}
          >
            Mitigation
            {activeTab === 'mitigation' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>
        
        {/* Content Area */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {renderContent()}
        </div>
        
        {/* Footer */}
        <div className="border-t border-blue-200 p-4 bg-blue-50/70 flex justify-between items-center">
          <div className="text-xs text-blue-600">
            <span className="font-medium">Data updated:</span> {new Date().toLocaleDateString()}
          </div>
          <button 
            onClick={handleCloseClick} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center text-sm font-medium"
          >
            Close
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
