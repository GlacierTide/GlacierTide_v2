import { Layout } from '../components/Layout';
import { useState, useEffect, useMemo } from 'react';
import { Filter, Search, Info, Calendar } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';

// Custom icon for markers
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

// Component to handle map view changes when region changes
function MapViewHandler({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// --- SEA REGION DEFINITIONS (REVISED) --- //
const seaRegions = {
  all: {
    id: 'all',
    name: 'All Seas',
    center: [30, 0],
  },
  arabiansea: {
    id: 'arabiansea',
    name: 'Arabian Sea',
    center: [15.9, 63.9], 
    bounds: [[5, 50], [25, 78]],
    polygon: [
      [25, 60], [23, 65], [20, 70], [15, 75], [10, 75], [7, 70], [8, 60], [15, 55], [20, 58], [25, 60]
    ],
    multiplier: 1.0,
  },
  caribbean: {
    id: 'caribbean',
    name: 'Caribbean Sea',
    center: [15.3, -76.1],
    bounds: [[8, -85], [22, -60]],
    polygon: [
      [22, -85], [22, -75], [18, -65], [12, -65], [8, -75], [10, -83], [15, -85], [22, -85]
    ],
    multiplier: 0.85,
  },
  philippine: {
    id: 'philippine',
    name: 'Philippine Sea',
    center: [10.4, 124.0],
    bounds: [[5, 120], [20, 130]],
    polygon: [
      [15, 120], [20, 125], [15, 130], [10, 128], [5, 125], [10, 120], [15, 120]
    ],
    multiplier: 2.05,
  },
  coral: {
    id: 'coral',
    name: 'Coral Sea',
    center: [-17.2, 151.4],
    bounds: [[-25, 145], [-10, 160]],
    polygon: [
      [-10, 145], [-10, 160], [-20, 160], [-25, 150], [-20, 145], [-10, 145]
    ],
    multiplier: 1.1,
  },
  labrador: {
    id: 'labrador',
    name: 'Labrador Sea',
    center: [55.9, -53.5],
    bounds: [[47, -64], [61, -43]],
    polygon: [
      [61, -56], [60, -50], [55, -43], [47, -52], [50, -64], [55, -60], [61, -56]
    ],
    multiplier: 0.85,
  },
  barents: {
    id: 'barents',
    name: 'Barents Sea',
    center: [75, 40],
    bounds: [[70, 20], [81, 65]],
    polygon: [
      [81, 28], [80, 40], [78, 60], [75, 65], [70, 50], [72, 30], [75, 20], [78, 28], [81, 28]
    ],
    multiplier: 1.2,
  },
};

// --- POINT-IN-POLYGON FUNCTION --- //
const isPointInPolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][1], yi = polygon[i][0];
    const xj = polygon[j][1], yj = polygon[j][0];
    const intersect = ((yi > point[0]) !== (yj > point[0])) &&
      (point[1] < (xj - xi) * (point[0] - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

// --- DATA DISTRIBUTION FUNCTION --- //
const distributeDataToSeaRegions = (rawData) => {
  // Get all years present in the data
  const years = [...new Set(rawData.map(item => item.Year))].sort();
  const regionKeys = Object.keys(seaRegions).filter(key => key !== 'all');
  const numSeas = regionKeys.length;
  let distributed = [];

  // Group data by year
  years.forEach(year => {
    // Filter all data points for this year
    const yearData = rawData.filter(item => item.Year === year);
    // Assign points in round-robin to seas
    yearData.forEach((item, i) => {
      const regionKey = regionKeys[i % numSeas];
      const region = seaRegions[regionKey];
      // Jitter for visualization
      const jitterAmount = 0.5;
      const offsetLat = (Math.sin(i) * jitterAmount);
      const offsetLng = (Math.cos(i) * jitterAmount);
      let latitude = region.center[0] + offsetLat;
      let longitude = region.center[1] + offsetLng;
      // Apply multiplier to sea level value
      const gia = parseFloat(item.SmoothedGSML_GIA || 0);
      const seaLevel = gia * region.multiplier;
      distributed.push({
        ...item,
        seaRegion: regionKey,
        seaRegionName: region.name,
        latitude,
        longitude,
        SmoothedGSML_GIA: seaLevel.toFixed(2),
      });
    });
  });
  return distributed;
};

// --- LEAFLET MAP COMPONENT --- //
const LeafletMap = ({ data, selectedRegion, seaCoords, selectedYear }) => {
  const center = seaCoords[selectedRegion]?.center || [0, 0];
  const zoom = selectedRegion === 'all' ? 2 : 5;
  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(item => item.seaRegion === selectedRegion);
    }
    if (selectedYear !== 'all') {
      filtered = filtered.filter(item => item.Year === selectedYear);
    }
    return filtered;
  }, [data, selectedRegion, selectedYear]);
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
      <MapViewHandler center={center} zoom={zoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {filteredData.map((item, index) => (
          <Marker
            key={`${item.seaRegion}-${item.Year}-${index}`}
            position={[item.latitude, item.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold text-glacier-800">Year: {item.Year}</h3>
                <p>Sea: {item.seaRegionName}</p>
                <p>Sea Level (GIA, multiplier applied): {item.SmoothedGSML_GIA} mm</p>
                <p>Observations: {item.TotalWeightedObservations}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

// --- MAIN WORLD MAP COMPONENT --- //
const WorldMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [availableYears, setAvailableYears] = useState(['all']);

  // Filter regions based on search query
  const filteredRegions = Object.values(seaRegions).filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics for the selected region and year
  const regionStats = useMemo(() => {
    let regionData = data;
    if (selectedRegion !== 'all') {
      regionData = regionData.filter(item => item.seaRegion === selectedRegion);
    }
    if (selectedYear !== 'all') {
      regionData = regionData.filter(item => item.Year === selectedYear);
    }
    if (regionData.length === 0) return { count: 0, average: 0, riseRate: 0 };
    
    const average = regionData.reduce((sum, item) =>
      sum + parseFloat(item.SmoothedGSML_GIA || 0), 0) / regionData.length;
    
    // Base rise rate
    const baseRiseRate = 3.2;
    
    // Apply multiplier to rise rate when a specific sea is selected
    let riseRate = baseRiseRate;
    if (selectedRegion !== 'all') {
      const multiplier = seaRegions[selectedRegion]?.multiplier || 1.0;
      riseRate = baseRiseRate * multiplier;
    }
    
    return {
      count: regionData.length,
      average: average.toFixed(2),
      riseRate: riseRate.toFixed(1)
    };
  }, [data, selectedRegion, selectedYear]);

  useEffect(() => {
    const loadData = async () => {
      try {
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
        // Distribute data points among sea regions
        const distributedData = distributeDataToSeaRegions(parsedData);
        setData(distributedData);
        // Set years for filter
        const years = [...new Set(parsedData.map(item => item.Year))].sort();
        setAvailableYears(['all', ...years]);
      } catch (error) {
        console.error("Error loading sea level data:", error);
      }
    };
    loadData();
  }, []);

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
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredRegions.map((region) => (
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
                {/* Year filter */}
                <div className="mt-6">
                  <h3 className="text-md font-medium text-black mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-glacier-700" />
                    Filter by Year
                  </h3>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="glacier-input w-full"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>
                        {year === 'all' ? 'All Years' : year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-8 p-4 bg-ice-50 rounded-lg border border-ice-100">
                  <div className="flex items-start mb-2">
                    <Info className="h-5 w-5 text-glacier-700 mr-2 flex-shrink-0 mt-0.5" />
                    <h3 className="text-md font-medium text-black">About this Map</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Explore global sea level changes. Select a sea region and year to view specific data points. Markers are clustered for better visualization. Click on clusters to zoom in and see individual points.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-3 glacier-card p-6">
                <h2 className="text-2xl font-semibold text-black mb-6">
                  {selectedRegion === 'all'
                    ? 'Global Sea Level Distribution'
                    : `${seaRegions[selectedRegion]?.name} Sea Levels`}
                  {selectedYear !== 'all' && ` (${selectedYear})`}
                </h2>
                <LeafletMap
                  data={data}
                  selectedRegion={selectedRegion}
                  selectedYear={selectedYear}
                  seaCoords={seaRegions}
                />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="font-medium text-black">Data Points</h3>
                    <p className="text-2xl font-bold text-glacier-600">{regionStats.count}</p>
                    <p className="text-sm text-gray-500">
                      {selectedRegion === 'all' ? 'Total Records' : `Records for ${seaRegions[selectedRegion]?.name}`}
                      {selectedYear !== 'all' && ` in ${selectedYear}`}
                    </p>
                  </div>
                  <div className="p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="font-medium text-black">Average Sea Level</h3>
                    <p className="text-2xl font-bold text-glacier-600">
                      {regionStats.average} mm
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedYear === 'all' ? '1993-2021' : selectedYear}
                    </p>
                  </div>
                  <div className="p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="font-medium text-black">Rise Rate</h3>
                    <p className="text-2xl font-bold text-glacier-600">{regionStats.riseRate} mm/yr</p>
                    <p className="text-sm text-gray-500">
                      {selectedRegion !== 'all' 
                        ? `Adjusted by ${seaRegions[selectedRegion].multiplier}× multiplier` 
                        : 'Global average'}
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

export default WorldMap;
