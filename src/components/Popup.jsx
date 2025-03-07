import { seaData } from './seaData';
import { useState, useEffect } from 'react';

function Popup({ seaName, onClose }) {
  const data = seaData[seaName];
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in on mount
    setIsVisible(true);
    
    // Add escape key listener
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleCloseClick = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation before unmounting
  };
  
  return (
    <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-40 flex items-center justify-center transition-opacity duration-300 ease-in-out"
         style={{ opacity: isVisible ? 1 : 0 }}>
      
      {/* Animated Snowflakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute text-white text-opacity-70 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-20px`,
              animation: `float ${3 + Math.random() * 5}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          >
            ❄
          </div>
        ))}
      </div>
      
      <div 
        className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-xl max-w-md w-11/12 transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} border border-blue-200 overflow-hidden`}
      >
        {/* Glacier-like header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 p-4 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 right-0 h-16 bg-white opacity-10 transform -skew-y-3 translate-y-2"></div>
            <div className="absolute top-6 left-0 right-0 h-8 bg-white opacity-10 transform skew-y-3"></div>
          </div>
          
          <h2 className="text-xl font-bold tracking-wide relative z-10 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Sea Analysis: {seaName}
          </h2>
        </div>
        
        {/* Content area */}
        <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Measurement Cards */}
            <div className="bg-white/80 p-3 rounded-lg shadow-sm border border-blue-100 backdrop-blur-sm hover:shadow-md transition-shadow">
              <h3 className="text-blue-800 font-medium mb-2 text-sm uppercase tracking-wide">Ice Measurements</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  <span className="text-gray-600 font-medium">Gigatonnes Loss:</span> 
                  <span className="text-blue-900 ml-auto">{data.gigatonnesIceLoss}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  <span className="text-gray-600 font-medium">Mass Balance:</span> 
                  <span className="text-blue-900 ml-auto">{data.massBalance}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  <span className="text-gray-600 font-medium">Flow Velocity:</span> 
                  <span className="text-blue-900 ml-auto">{data.iceFlowVelocity}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  <span className="text-gray-600 font-medium">Length Changes:</span> 
                  <span className="text-blue-900 ml-auto">{data.glacierLengthChanges}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                  <span className="text-gray-600 font-medium">Calving Rates:</span> 
                  <span className="text-blue-900 ml-auto">{data.icebergCalvingRates}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/80 p-3 rounded-lg shadow-sm border border-blue-100 backdrop-blur-sm hover:shadow-md transition-shadow">
              <h3 className="text-teal-700 font-medium mb-2 text-sm uppercase tracking-wide">Sea Level Metrics</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>
                  <span className="text-gray-600 font-medium">SLE:</span> 
                  <span className="text-teal-800 ml-auto">{data.seaLevelEquivalent}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>
                  <span className="text-gray-600 font-medium">Global Mean:</span> 
                  <span className="text-teal-800 ml-auto">{data.globalMeanSeaLevel}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>
                  <span className="text-gray-600 font-medium">Regional Change:</span> 
                  <span className="text-teal-800 ml-auto">{data.regionalSeaLevelChange}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>
                  <span className="text-gray-600 font-medium">Rise Rate:</span> 
                  <span className="text-teal-800 ml-auto">{data.rateOfSeaLevelRise}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/80 p-3 rounded-lg shadow-sm border border-blue-100 backdrop-blur-sm hover:shadow-md transition-shadow md:col-span-2">
              <h3 className="text-indigo-700 font-medium mb-2 text-sm uppercase tracking-wide">Climate Conditions</h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex flex-col items-center p-2 bg-indigo-50 rounded">
                  <svg className="w-5 h-5 text-indigo-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-gray-600 text-xs">Surface Temp</span>
                  <span className="text-indigo-800 font-medium">{data.surfaceTemperature}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-indigo-50 rounded">
                  <svg className="w-5 h-5 text-indigo-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="text-gray-600 text-xs">Precipitation</span>
                  <span className="text-indigo-800 font-medium">{data.precipitation}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-indigo-50 rounded">
                  <svg className="w-5 h-5 text-indigo-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-gray-600 text-xs">Ocean Temp</span>
                  <span className="text-indigo-800 font-medium">{data.oceanTemperature}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t border-blue-100 p-4 bg-blue-50 flex justify-end">
          <button 
            onClick={handleCloseClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}



export default Popup;