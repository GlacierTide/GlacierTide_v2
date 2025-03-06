import Hero from '../components/Hero';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Globe2, Shield, Users } from 'lucide-react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}) => (
  <div 
    className="glacier-card p-6 hover:shadow-xl"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-lg bg-glacier-50 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-glacier-600" />
    </div>
    <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

const Index = () => {
  return (
    <Layout>
      <div className="page-transition">
        <Hero />
        
        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                Explore Our Features
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Discover how GlacierTide is revolutionizing glacier monitoring and climate research through cutting-edge technology.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={BarChart3} 
                title="Prediction Tools" 
                description="Advanced forecasting models to predict glacier changes and climate impacts."
                delay={100}
              />
              <FeatureCard 
                icon={Globe2} 
                title="Interactive Map" 
                description="Explore glaciers worldwide with our detailed interactive mapping system."
                delay={200}
              />
              <FeatureCard 
                icon={Shield} 
                title="Climate Protection" 
                description="Resources and strategies for glacial preservation and climate action."
                delay={300}
              />
              <FeatureCard 
                icon={Users} 
                title="Expert Community" 
                description="Connect with researchers, climate scientists, and activists."
                delay={400}
              />
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-glacier-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Join the GlacierTide Community
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                Be part of the global effort to understand and protect our planet's most precious frozen resources. Sign up today for exclusive access to our tools and research.
              </p>
              <Link to="/sign-up" className="btn-primary inline-flex items-center group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;