import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ice-50 border-t border-ice-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-black font-bold text-xl mb-4">
            <span><span className="text-glacier-600">Glacier</span>Tide</span>
            </Link>
            <p className="text-gray-500 mb-4">
              Exploring the world's glaciers and monitoring climate changes with cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/GlacierTide/GlacierTide_v2/tree/ml" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Site Links */}
          <div className="col-span-1">
            <h3 className="text-black font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">About</Link>
              </li>
              <li>
                <Link to="/prediction-tool" className="footer-link">Prediction Tool</Link>
              </li>
              <li>
                <Link to="/globe" className="footer-link">Globe</Link>
              </li>
              <li>
                <Link to="/world-map" className="footer-link">World Map</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-1">
            <h3 className="text-black font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="footer-link">Terms of Service</Link>
              </li>
              <li>
                <Link to="/cookies-policy" className="footer-link">Cookies Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-black font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-glacier-500" />
                <span className="text-gray-500">glaciertide4@gmail.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-glacier-500" />
                <span className="text-gray-500">+91 9999988888</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ice-100 mt-10 pt-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} GlacierTide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
