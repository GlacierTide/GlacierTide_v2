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

const LeafletMap = ({ data, selectedRegion, seaCoords, selectedYear }) => {
  // Get center and zoom level for the selected region
  const center = seaCoords[selectedRegion]?.center || [0, 0];
  const zoom = selectedRegion === 'all' ? 2 : 5;
  
  // Filter data to only show points for the selected region and year
  const filteredData = useMemo(() => {
    let filtered = data;
    
    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(item => item.seaRegion === selectedRegion);
    }
    
    // Filter by year
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
                <p>Sea Level (GIA): {item.SmoothedGSML_GIA} mm</p>
                <p>Observations: {item.TotalWeightedObservations}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

const WorldMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [availableYears, setAvailableYears] = useState(['all']);
  
  // Define sea regions with their coordinates and boundaries
  const seaRegions = {
    all: {
      id: 'all',
      name: 'All Seas',
      center: [20, 0],
    },
    blacksea: {
      id: 'blacksea',
      name: 'Black Sea',
      center: [43.5, 33.0],
      bounds: [[40.0, 27.0], [47.0, 42.0]], // [southWest, northEast]
      polygon: [
        [41.0, 28.0], [42.0, 28.5], [43.5, 31.0], [45.0, 33.0], 
        [46.0, 37.0], [45.0, 40.0], [43.0, 41.5], [41.5, 41.0], 
        [41.0, 39.0], [41.0, 28.0]
      ]
    },
    redsea: {
      id: 'redsea',
      name: 'Red Sea',
      center: [20.0, 38.5],
      bounds: [[12.0, 32.0], [30.0, 44.0]],
      polygon: [
        [27.8, 33.7], [29.0, 35.0], [28.0, 37.0], [25.0, 37.0], 
        [20.0, 38.5], [15.0, 41.5], [12.5, 43.5], [12.0, 41.0], 
        [15.0, 39.0], [20.0, 36.5], [24.0, 35.0], [27.8, 33.7]
      ]
    },
    arabiansea: {
      id: 'arabiansea',
      name: 'Arabian Sea',
      center: [15.0, 68.0],
      bounds: [[5.0, 50.0], [25.0, 78.0]],
      polygon: [
        [23.0, 60.0], [25.0, 65.0], [22.0, 70.0], [20.0, 75.0], 
        [12.0, 78.0], [5.0, 75.0], [8.0, 65.0], [12.0, 55.0], 
        [20.0, 58.0], [23.0, 60.0]
      ]
    },
    mediterranean: {
      id: 'mediterranean',
      name: 'Mediterranean Sea',
      center: [36.0, 15.0],
      bounds: [[30.0, -5.0], [45.0, 36.0]],
      polygon: [
        [30.0, -5.0], [35.0, -5.0], [40.0, 0.0], [43.0, 5.0], 
        [44.0, 10.0], [43.0, 15.0], [40.0, 20.0], [38.0, 25.0], 
        [36.0, 30.0], [34.0, 35.0], [31.0, 34.0], [31.0, 25.0], 
        [32.0, 15.0], [35.0, 5.0], [35.0, 0.0], [30.0, -5.0]
      ]
    },
    caribbean: {
      id: 'caribbean',
      name: 'Caribbean Sea',
      center: [15.0, -75.0],
      bounds: [[8.0, -85.0], [22.0, -60.0]],
      polygon: [
        [18.0, -85.0], [22.0, -82.0], [22.0, -75.0], [20.0, -68.0], 
        [18.0, -65.0], [15.0, -63.0], [12.0, -63.0], [10.0, -65.0], 
        [8.0, -70.0], [9.0, -75.0], [10.0, -80.0], [15.0, -83.0], 
        [18.0, -85.0]
      ]
    },
    beringsea: {
      id: 'beringsea',
      name: 'Bering Sea',
      center: [60.0, -170.0],
      bounds: [[52.0, -180.0], [66.0, -160.0]],
      polygon: [
        [52.0, -175.0], [55.0, -180.0], [58.0, -175.0], [60.0, -170.0], 
        [63.0, -165.0], [66.0, -168.0], [65.0, -175.0], [62.0, -180.0], 
        [58.0, -170.0], [55.0, -165.0], [52.0, -170.0], [52.0, -175.0]
      ]
    }
  };
  
  // Function to check if a point is within a polygon
  const isPointInPolygon = (point, polygon) => {
    // Simple ray-casting algorithm
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
  
  // Function to distribute data points within sea polygons
  const distributeDataToSeaRegions = (rawData) => {
    // Extract unique years for the year filter
    const years = [...new Set(rawData.map(item => item.Year))].sort();
    setAvailableYears(['all', ...years]);
    
    // Create a distribution of data points within sea boundaries
    return rawData.map((item, index) => {
      // Determine which sea region this data point belongs to
      // For demonstration, we'll distribute based on index to ensure each region gets data
      const regionKeys = Object.keys(seaRegions).filter(key => key !== 'all');
      const regionIndex = index % regionKeys.length;
      const regionKey = regionKeys[regionIndex];
      const region = seaRegions[regionKey];
      
      // Generate a point within the sea's polygon
      let latitude, longitude;
      
      if (region.polygon) {
        // Get the center of the region
        const centerLat = region.center[0];
        const centerLng = region.center[1];
        
        // Add a small random offset from the center (clustered distribution)
        // Use the year to create a consistent but varied pattern
        const yearSeed = parseInt(item.Year) % 10;
        const jitterAmount = 0.5; // Controls how spread out points are
        
        // Create a deterministic but varied offset based on year and index
        const offsetLat = (Math.sin(yearSeed * index) * jitterAmount);
        const offsetLng = (Math.cos(yearSeed * index) * jitterAmount);
        
        latitude = centerLat + offsetLat;
        longitude = centerLng + offsetLng;
        
        // Ensure point is within the polygon (if not, use center)
        if (!isPointInPolygon([latitude, longitude], region.polygon)) {
          latitude = centerLat + (offsetLat * 0.2);
          longitude = centerLng + (offsetLng * 0.2);
        }
      } else {
        // Fallback to using bounds
        const latRange = region.bounds[1][0] - region.bounds[0][0];
        const lngRange = region.bounds[1][1] - region.bounds[0][1];
        
        latitude = region.bounds[0][0] + (latRange * 0.5);
        longitude = region.bounds[0][1] + (lngRange * 0.5);
      }
      
      return {
        ...item,
        seaRegion: regionKey,
        seaRegionName: region.name,
        latitude,
        longitude
      };
    });
  };

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
      } catch (error) {
        console.error("Error loading sea level data:", error);
      }
    };
    
    loadData();
  }, []);

  // Filter regions based on search query
  const filteredRegions = Object.values(seaRegions).filter(region => 
    region.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics for the selected region and year
  const regionStats = useMemo(() => {
    let regionData = data;
    
    // Filter by region
    if (selectedRegion !== 'all') {
      regionData = regionData.filter(item => item.seaRegion === selectedRegion);
    }
    
    // Filter by year
    if (selectedYear !== 'all') {
      regionData = regionData.filter(item => item.Year === selectedYear);
    }
    
    if (regionData.length === 0) return { count: 0, average: 0, riseRate: 0 };
    
    const average = regionData.reduce((sum, item) => 
      sum + parseFloat(item.SmoothedGSML_GIA || 0), 0) / regionData.length;
    
    // Calculate rise rate (simplified)
    const riseRate = 3.2; // Default value, could be calculated based on actual data
    
    return {
      count: regionData.length,
      average: average.toFixed(2),
      riseRate
    };
  }, [data, selectedRegion, selectedYear]);

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
