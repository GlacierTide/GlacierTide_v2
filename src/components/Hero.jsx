import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import Particles from 'react-particles';
import { loadSlim } from 'tsparticles-slim';

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden mt-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-sky-200 opacity-95"></div>
      
      {/* Particles Background */}
      {mounted && (
        <Particles
          id="tsparticles"
          init={particlesInit}
          className="absolute inset-0 z-[1]"
          options={{
            fullScreen: { enable: false },
            fpsLimit: 30,
            particles: {
              color: {
                value: ["#72ffff", "#a0ffff", "#00fff7", "#00FFFF"]
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "out"
                },
                random: true,
                speed: {
                  min: 1,
                  max: 1.5
                },
                straight: false,
                attract: {
                  enable: true,
                  rotateX: 600,
                  rotateY: 1200
                }
              },
              number: {
                density: {
                  enable: true,
                  area: 800
                },
                value: 700
              },
              opacity: {
                value: {
                  min: 0.4,
                  max: 0.7
                },
                animation: {
                  enable: true,
                  speed: 0.6,
                  minimumValue: 0.1,
                  sync: false
                }
              },
              shape: {
                type: "circle"
              },
              size: {
                value: {
                  min: 3,
                  max: 7
                },
                animation: {
                  enable: true,
                  speed: 4,
                  minimumValue: 0.5,
                  sync: false
                }
              },
              wobble: {
                enable: true,
                distance: 10,
                speed: {
                  min: 1,
                  max: 3
                }
              },
              zIndex: {
                value: {
                  min: 0,
                  max: 100
                },
                opacityRate: 0.2,
                sizeRate: 1,
                velocityRate: 1
              }
            },
            interactivity: {
              detectsOn: "canvas",
              events: {
                onHover: {
                  enable: true,
                  mode: "bubble"
                },
                resize: true
              },
              modes: {
                bubble: {
                  distance: 200,
                  size: 8,
                  duration: 0.4,
                  opacity: 0.2,
                  speed: 3
                }
              }
            },
            background: {
              color: {
                value: "transparent"
              }
            },
            detectRetina: true
          }}
        />
      )}
      
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-300 to-cyan-100 animate-float blur-2xl"></div>
        <div className="absolute top-2/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-300 animate-flow blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 rounded-full bg-cyan-200 animate-pulse-slow blur-xl"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 z-10 text-center space-y-8">
        <div className="animate-fade-in-down">
          <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-cyan-100 text-cyan-500 border border-cyan-200 mb-4">
            Explore Earth's Frozen Wonders
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black leading-tight md:leading-tight animate-fade-in">
          Discover the Beauty of <br />
          
          <span className="text-cyan-500">Glacier</span>
          <span className="relative inline-flex">
            Tide
            <span className="absolute -bottom-2 left-0 w-full h-1.5 bg-cyan-300 rounded-full"></span>
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-black max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Understanding, predicting and preserving our planet's glaciers with advanced technology and research.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center  justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <Link to="/sign-up" className="btn-primary  ">
            Join Us
          </Link>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-10" onClick={scrollToContent}>
        <ChevronDown className="h-8 w-8 text-cyan-500" />
      </div>
    </section>
  );
};

export default Hero;
