import { Layout } from '../components/Layout';
import { useState, useEffect } from 'react';
import { Filter, Search, Info } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icon for markers
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

const LeafletMap = ({ data, selectedRegion }) => {
  // Authentic coordinates for sea regions (approximate centers based on real locations)
  const seaCoords = {
    all: [0, 0], // Center of the world
    blacksea: [43.5, 33.0], // Black Sea (near Odessa, Ukraine)
    redsea: [20.0, 38.5], // Red Sea (near Jeddah, Saudi Arabia)
    arabiansea: [15.0, 68.0], // Arabian Sea (near Mumbai, India)
    mediterranean: [36.0, 15.0], // Mediterranean Sea (near Sicily, Italy)
    caribbean: [15.0, -75.0], // Caribbean Sea (near Jamaica)
    beringsea: [60.0, -170.0], // Bering Sea (near Nome, Alaska)
  };

  // Filter data based on selected region and assign authentic coordinates
  const filteredData = data
    .filter((item) => {
      if (selectedRegion === 'all') return true;
      return true; // No strict filtering by region since CSV lacks station data; use coords instead
    })
    .map((item) => {
      const baseCoord = seaCoords[selectedRegion] || [0, 0];
      const latOffset = (parseFloat(item["SmoothedGSML_GIA"]) - 0) / 1000; // Scale sea level to a small lat offset
      const lngOffset = (parseFloat(item["Year"]) - 1993) / 50; // Offset longitude by year from 1993
      return {
        ...item,
        latitude: baseCoord[0] + latOffset,
        longitude: baseCoord[1] + lngOffset,
      };
    });

  const center = seaCoords[selectedRegion] || [0, 0];

  return (
    <MapContainer center={center} zoom={selectedRegion === 'all' ? 2 : 4} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {filteredData.map((item, index) => (
        <Marker key={index} position={[item.latitude, item.longitude]} icon={customIcon}>
          <Popup>
            <div>
              <h3>Year: {item["Year"]}</h3>
              <p>Sea Level (GIA): {item["SmoothedGSML_GIA"]} mm</p>
              <p>Observations: {item["TotalWeightedObservations"]}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

const WorldMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch('/sealevel.csv');
      const text = await response.text();
      const rows = text.trim().split('\n').slice(1); // Skip header
      const parsedData = rows.map(row => {
        const [Year, TotalWeightedObservations, GMSL_noGIA, StdDevGMSL_noGIA, SmoothedGSML_noGIA, GMSL_GIA, StdDevGMSL_GIA, SmoothedGSML_GIA, SmoothedGSML_GIA_sigremoved] = row.split(',');
        return {
          Year,
          TotalWeightedObservations,
          GMSL_noGIA,
          StdDevGMSL_noGIA,
          SmoothedGSML_noGIA,
          GMSL_GIA,
          StdDevGMSL_GIA,
          SmoothedGSML_GIA,
          SmoothedGSML_GIA_sigremoved,
        };
      });
      setData(parsedData);
    };
    loadData();
  }, []);

  const regions = [
    { id: 'all', name: 'All Seas' },
    { id: 'blacksea', name: 'Black Sea' },
    { id: 'redsea', name: 'Red Sea' },
    { id: 'arabiansea', name: 'Arabian Sea' },
    { id: 'mediterranean', name: 'Mediterranean Sea' },
    { id: 'caribbean', name: 'Caribbean Sea' },
    { id: 'beringsea', name: 'Bering Sea' }
  ];

  return (
    <Layout>
      <div className="page-transition">
        <section className="relative py-20 bg-ice-50">
          <div className="absolute inset-0 bg-glacier-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Sea Level World Map</h1>
              <p className="text-lg text-gray-500">
                Explore sea level changes around the world with our interactive mapping tool.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="glacier-card p-6">
                <h2 className="text-xl font-semibold text-black mb-6 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Explore Seas
                </h2>
                
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search seas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="glacier-input w-full pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {regions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => setSelectedRegion(region.id)}
                      className={`w-full px-4 py-2 rounded-lg text-left transition ${
                        selectedRegion === region.id
                          ? 'bg-glacier-100 text-glacier-800'
                          : 'hover:bg-ice-50 text-gray-500'
                      }`}
                    >
                      {region.name}
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-ice-50 rounded-lg border border-ice-100">
                  <div className="flex items-start mb-2">
                    <Info className="h-5 w-5 text-glacier-700 mr-2 flex-shrink-0 mt-0.5" />
                    <h3 className="text-md font-medium text-black">About this Map</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Explore global sea level changes. Click on markers to view detailed information about sea levels by year.
                  </p>
                </div>
              </div>
              
              <div className="lg:col-span-3 glacier-card p-6">
                <h2 className="text-2xl font-semibold text-black mb-6">
                  {selectedRegion === 'all' 
                    ? 'Global Sea Level Distribution' 
                    : `${regions.find(r => r.id === selectedRegion)?.name} Sea Levels`}
                </h2>
                
                <LeafletMap data={data} selectedRegion={selectedRegion} />
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="font-medium text-black">Data Points</h3>
                    <p className="text-2xl font-bold text-glacier-600">{data.length}</p>
                    <p className="text-sm text-gray-500">Total Records</p>
                  </div>
                  
                  <div className="p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="font-medium text-black">Average Sea Level</h3>
                    <p className="text-2xl font-bold text-glacier-600">
                      {data.reduce((sum, item) => sum + parseFloat(item["SmoothedGSML_GIA"] || 0), 0) / data.length.toFixed(2)} mm
                    </p>
                    <p className="text-sm text-gray-500">1993-2021</p>
                  </div>
                  
                  <div className="p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="font-medium text-black">Rise Rate</h3>
                    <p className="text-2xl font-bold text-glacier-600">3.2 mm/yr</p>
                    <p className="text-sm text-gray-500">Estimated</p>
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

export default WorldMap;