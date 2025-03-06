
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, UserPlus } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: '' };
    
    if (password.length < 6) return { strength: 1, label: 'Weak' };
    if (password.length < 10) return { strength: 2, label: 'Moderate' };
    if (password.length >= 10) return { strength: 3, label: 'Strong' };
    
    return { strength: 0, label: '' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <Layout>
      <div className="page-transition">
        <section className="min-h-screen-minus-nav flex flex-col md:flex-row">
          {/* Left Side - Image */}
          <div className="hidden md:block w-1/2 bg-gradient-to-br from-glacier-500 to-glacier-800 relative overflow-hidden">
            {/* Glacier/Snow Pattern Overlay */}
            <div className="absolute inset-0 bg-glacier-pattern opacity-10"></div>
            
            {/* Flowing Elements */}
            <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-flow"></div>
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-white/20 blur-3xl animate-flow" style={{ animationDelay: '1.5s' }}></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
              <h2 className="text-3xl font-bold mb-8 text-center">Join the GlacierTide Community</h2>
              
              <div className="space-y-6 max-w-md">
                <div className="flex items-start">
                  <CheckCircle2 className="text-white h-6 w-6 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Access Premium Tools</h3>
                    <p className="text-white/80">Explore our prediction tools, interactive maps, and scientific resources.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="text-white h-6 w-6 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Join Global Research</h3>
                    <p className="text-white/80">Participate in community-driven glacier monitoring and conservation projects.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle2 className="text-white h-6 w-6 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-xl mb-1">Stay Informed</h3>
                    <p className="text-white/80">Receive updates on climate research, glacier events, and educational opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8">
            <div className="max-w-md w-full">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-black mb-2">Create Account</h1>
                <p className="text-gray-500">Join the global community of glacier enthusiasts</p>
              </div>

              <div className="glacier-card p-8">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-600 mb-2 font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="glacier-input w-full"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-gray-600 mb-2 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="glacier-input w-full"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-gray-600 mb-2 font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="glacier-input w-full pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      
                      {/* Password strength indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex space-x-1 w-full">
                              <div className={`h-2 flex-1 rounded-l-full ${
                                passwordStrength.strength >= 1 
                                  ? 'bg-red-500' 
                                  : 'bg-ice-200'
                              }`}></div>
                              <div className={`h-2 flex-1 ${
                                passwordStrength.strength >= 2 
                                  ? 'bg-yellow-500' 
                                  : 'bg-ice-200'
                              }`}></div>
                              <div className={`h-2 flex-1 rounded-r-full ${
                                passwordStrength.strength >= 3 
                                  ? 'bg-green-500' 
                                  : 'bg-ice-200'
                              }`}></div>
                            </div>
                            <span className="text-xs text-gray-500 ml-2 w-16 text-right">
                              {passwordStrength.label}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-gray-600 mb-2 font-medium">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="glacier-input w-full pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      
                      {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                      )}
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        required
                        className="h-4 w-4 mt-1 text-glacier-600 rounded border-ice-300 focus:ring-glacier-500"
                      />
                      <label htmlFor="agreeTerms" className="ml-2 block text-gray-600 text-sm">
                        I agree to the{' '}
                        <Link to="/terms-of-service" className="text-glacier-600 hover:text-glacier-700">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy-policy" className="text-glacier-600 hover:text-glacier-700">
                          Privacy Policy
                        </Link>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn-primary w-full flex items-center justify-center group"
                      disabled={
                        !formData.email || 
                        !formData.password || 
                        formData.password !== formData.confirmPassword || 
                        !formData.agreeTerms
                      }
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Account
                    </button>

                    <p className="text-center text-gray-600">
                      Already have an account?{' '}
                      <Link to="/sign-in" className="text-glacier-600 hover:text-glacier-700 font-medium">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default SignUp;
