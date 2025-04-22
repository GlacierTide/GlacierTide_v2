import { useState, useEffect } from 'react';

function Popup({ seaName, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mlData, setMlData] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchMLData();

    const handleEscape = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [seaName, onClose]);

  const fetchMLData = async () => {
    try {
      const futureYear = new Date().getFullYear() + 20; // Predict 20 years ahead
      const response = await fetch(`/api/ml/predict/${encodeURIComponent(seaName)}/${futureYear}`);
      if (!response.ok) {
        const text = await response.text(); // Log the raw response
        console.error('Fetch failed:', { status: response.status, text });
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMlData(data);
    } catch (error) {
      console.error('Error fetching ML data:', error);
      setMlData({ error: 'Failed to load ML predictions' });
    }
  };

  const handleCloseClick = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-40 flex items-center justify-center transition-opacity duration-300 ease-in-out"
         style={{ opacity: isVisible ? 1 : 0 }}>
      <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-xl max-w-md w-11/12 transform transition-all duration-300 ease-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'} border border-blue-200 overflow-hidden`}>
        <div className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 p-4 text-white relative overflow-hidden">
          <h2 className="text-xl font-bold tracking-wide relative z-10 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Sea Analysis: {seaName}
          </h2>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 p-3 rounded-lg shadow-sm border border-blue-100 backdrop-blur-sm hover:shadow-md transition-shadow">
              <h3 className="text-blue-800 font-medium mb-2 text-sm uppercase tracking-wide">ML Predictions (20 Years)</h3>
              <ul className="space-y-2 text-sm">
                {mlData && Object.entries(mlData).map(([model, value]) => (
                  <li key={model} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                    <span className="text-gray-600 font-medium">{model}:</span>
                    <span className="text-blue-900 ml-auto">{value} mm</span>
                  </li>
                ))}
                {mlData && mlData.error && <li className="text-red-500">{mlData.error}</li>}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-100 p-4 bg-blue-50 flex justify-end">
          <button onClick={handleCloseClick} className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Popup;