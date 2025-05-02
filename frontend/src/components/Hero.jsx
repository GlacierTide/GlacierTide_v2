import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    
    <section className="relative h-screen flex items-center justify-center overflow-hidden mt-4">
     {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-glacier-50 to-glacier-200 opacity-95"></div>
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-glacier-300/20 to-glacier-100/10 animate-float blur-2xl"></div>
        <div className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-glacier-200/20 to-glacier-400/10 animate-flow blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-glacier-200/20 animate-pulse-slow blur-xl"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 z-10 text-center space-y-8">
        <div className="animate-fade-in-down">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-glacier-100 text-glacier-800 border border-glacier-200 mb-4">
            Explore Earth's Frozen Wonders
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black leading-tight md:leading-tight animate-fade-in">
          Discover the Beauty of <br />
          
          <span className="text-glacier-600">Glacier</span>
          <span className="relative inline-flex">
            Tide
            <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-glacier-400/60 rounded-full"></span>
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-black max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Understanding, predicting and preserving our planet's glaciers with advanced technology and research.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Link to="/sign-up" className="btn-primary">
            Join Us
          </Link>
          
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToContent}>
        <ChevronDown className="h-8 w-8 text-glacier-500" />
      </div>
    </section>
  );
};

export default Hero;
