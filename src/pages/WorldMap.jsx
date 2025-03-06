import { Layout } from '../components/Layout';
import { useState } from 'react';
import { Filter, Search, Info, Layers } from 'lucide-react';

const MapView = () => (
  <div className="rounded-lg overflow-hidden min-h-[500px] border border-ice-200 bg-gradient-to-br from-glacier-50 to-ice-100 flex items-center justify-center">
    <div className="text-center text-gray-600 p-6">
      <Layers className="mx-auto h-10 w-10 text-glacier-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
      <p>This is where the interactive map would be displayed, showcasing glacier locations worldwide.</p>
    </div>
  </div>
);

const WorldMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'arctic', name: 'Arctic' },
    { id: 'antarctica', name: 'Antarctica' },
    { id: 'alps', name: 'European Alps' },
    { id: 'himalaya', name: 'Himalayas' },
    { id: 'andes', name: 'Andes Mountains' },
    { id: 'alaska', name: 'Alaska Range' }
  ];

  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="relative py-20 bg-ice-50">
          <div className="absolute inset-0 bg-glacier-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">Glacier World Map</h1>
              <p className="text-lg text-gray-500">
                Explore glaciers around the world with our interactive mapping tool.
              </p>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="glacier-card p-6">
                <h2 className="text-xl font-semibold text-black mb-6 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Explore Regions
                </h2>
                
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search glaciers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="glacier-input w-full pl-10"
                    />
                  </div>
                </div>
                
                {/* Regions */}
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
                
                {/* Info Box */}
                <div className="mt-8 p-4 bg-ice-50 rounded-lg border border-ice-100">
                  <div className="flex items-start mb-2">
                    <Info className="h-5 w-5 text-glacier-700 mr-2 flex-shrink-0 mt-0.5" />
                    <h3 className="text-md font-medium text-black">About this Map</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Explore the world's most significant glaciers and ice sheets. Click on specific glaciers to view detailed information about their size, changes over time, and environmental significance.
                  </p>
                </div>
              </div>
              
              {/* Map Area */}
              <div className="lg:col-span-3 glacier-card p-6">
                <h2 className="text-2xl font-semibold text-black mb-6">
                  {selectedRegion === 'all' 
                    ? 'Global Glacier Distribution' 
                    : `${regions.find(r => r.id === selectedRegion)?.name} Glaciers`}
                </h2>
                
                <MapView />
                
                {/* Selected Region Details */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="font-medium text-black">Glacier Count</h3>
                    <p className="text-2xl font-bold text-glacier-600">200,000+</p>
                    <p className="text-sm text-gray-500">Worldwide</p>
                  </div>
                  
                  <div className="p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="font-medium text-black">Total Area</h3>
                    <p className="text-2xl font-bold text-glacier-600">726,000 km²</p>
                    <p className="text-sm text-gray-500">Global coverage</p>
                  </div>
                  
                  <div className="p-4 bg-ice-50 rounded-lg border border-ice-100">
                    <h3 className="font-medium text-black">Annual Loss Rate</h3>
                    <p className="text-2xl font-bold text-glacier-600">1.2%</p>
                    <p className="text-sm text-gray-500">Global average</p>
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
