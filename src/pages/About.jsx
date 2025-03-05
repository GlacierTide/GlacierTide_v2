import { Layout } from '../components/Layout';
import { Clock, Droplets, MapPin, ThermometerSnowflake } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="relative py-20 bg-ice-50">
          <div className="absolute inset-0 bg-glacier-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-ice-900 mb-6">About GlacierTide</h1>
              <p className="text-lg text-ice-700">
                Dedicated to monitoring, understanding, and protecting the world's glaciers through innovation and collaboration.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-ice-900 mb-6">Our Mission</h2>
              <p className="text-ice-700 text-lg mb-6">
                GlacierTide was founded with a clear mission: to advance our understanding of glacier dynamics and their relationship with climate change. We combine cutting-edge technology with scientific expertise to monitor glacier changes, predict future trends, and develop strategies for preservation.
              </p>
              <p className="text-ice-700 text-lg">
                Our comprehensive approach encompasses glacier monitoring, climate data analysis, predictive modeling, and public awareness efforts. We believe that by sharing knowledge and fostering collaboration, we can contribute to global efforts to address climate change and protect these vital ecosystems.
              </p>
            </div>
          </div>
        </section>

        {/* Key Facts */}
        <section className="py-16 bg-gradient-to-b from-ice-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-ice-900 mb-10 text-center">Key Facts About Glaciers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="glacier-card p-6 flex flex-col items-center text-center">
                <ThermometerSnowflake className="h-10 w-10 text-glacier-600 mb-4" />
                <h3 className="text-xl font-semibold text-ice-900 mb-2">Temperature Sensitive</h3>
                <p className="text-ice-600">
                  Glaciers serve as early indicators of climate change, responding visibly to temperature fluctuations.
                </p>
              </div>
              
              <div className="glacier-card p-6 flex flex-col items-center text-center">
                <Droplets className="h-10 w-10 text-glacier-600 mb-4" />
                <h3 className="text-xl font-semibold text-ice-900 mb-2">Water Reservoirs</h3>
                <p className="text-ice-600">
                  They store about 75% of the world's freshwater, crucial for ecosystems and human communities.
                </p>
              </div>
              
              <div className="glacier-card p-6 flex flex-col items-center text-center">
                <Clock className="h-10 w-10 text-glacier-600 mb-4" />
                <h3 className="text-xl font-semibold text-ice-900 mb-2">Ancient History</h3>
                <p className="text-ice-600">
                  Some glaciers contain ice formed thousands of years ago, preserving valuable climate records.
                </p>
              </div>
              
              <div className="glacier-card p-6 flex flex-col items-center text-center">
                <MapPin className="h-10 w-10 text-glacier-600 mb-4" />
                <h3 className="text-xl font-semibold text-ice-900 mb-2">Global Distribution</h3>
                <p className="text-ice-600">
                  Glaciers exist on every continent except Australia, covering about 10% of Earth's land area.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-ice-900 mb-4">Our Team</h2>
              <p className="text-ice-700">
                Our diverse team of scientists, engineers, data analysts, and conservation specialists work together to advance glacier research and protection.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="glacier-card p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-glacier-100 mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-glacier-200 to-glacier-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-ice-900 mb-1">Team Member</h3>
                  <p className="text-glacier-600 text-sm mb-3">Position</p>
                  <p className="text-ice-600">
                    Expert in glaciology with a passion for climate research and conservation efforts.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
