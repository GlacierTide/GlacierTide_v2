import { useState, useEffect } from 'react';

function Popup({ seaName, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mlData, setMlData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('predictions');

  useEffect(() => {
    setIsVisible(true);
    fetchMLData();

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
      setMlData(data);
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
                    {Object.entries(mlData).map(([model, value]) => (
                      <div key={model} className="flex items-center gap-2 group hover:bg-blue-50 p-2 rounded-md transition-colors">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-gray-700 font-medium">{model}:</span>
                        <span className="text-blue-900 ml-auto font-bold">{value} mm</span>
                      </div>
                    ))}
                    <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mt-4">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>These predictions show estimated sea level changes for {seaName} over the next 20 years based on our climate models.</p>
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
              Average sea level rise over the past decade: <span className="font-semibold text-blue-700">2.8 mm/year</span>
            </p>
          </div>
        </div>
      );
    } else if (activeTab === 'impact') {
      return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <h3 className="text-blue-800 font-medium mb-3">Potential Impact Analysis</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="bg-yellow-100 p-1 rounded-full">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <span className="font-medium">Coastal Erosion:</span> Accelerated erosion patterns in coastal areas adjacent to {seaName}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-blue-100 p-1 rounded-full">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <span className="font-medium">Infrastructure:</span> Potential risk to low-lying coastal infrastructure
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-100 p-1 rounded-full">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <span className="font-medium">Ecosystem:</span> Changes to coastal ecosystems and biodiversity
              </div>
            </li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
          <h3 className="text-blue-800 font-medium mb-3">Mitigation Strategies</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <span className="font-medium block">Coastal Defenses:</span>
                <p className="text-sm text-gray-600">Natural and engineered solutions to protect shorelines.</p>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="font-medium block">Early Warning Systems:</span>
                <p className="text-sm text-gray-600">Monitoring and alert systems for storm surges and flooding events.</p>
              </div>
            </div>
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