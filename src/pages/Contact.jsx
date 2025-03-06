import { Layout } from '../components/Layout';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1000);
  };

  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="relative py-20 bg-ice-50">
          <div className="absolute inset-0 bg-glacier-pattern opacity-5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-ice-900 mb-6">Contact Us</h1>
              <p className="text-lg text-ice-700">
                Have questions or want to collaborate? Reach out to our team.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Contact Info */}
                <div className="lg:col-span-2">
                  <div className="glacier-card p-8 h-full">
                    <h2 className="text-2xl font-semibold text-ice-900 mb-6">Get in Touch</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="bg-glacier-50 rounded-full p-3 mr-4">
                          <Mail className="h-6 w-6 text-glacier-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-ice-900">Email</h3>
                          <p className="text-ice-600">info@glaciertide.com</p>
                          <p className="text-ice-600">support@glaciertide.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-glacier-50 rounded-full p-3 mr-4">
                          <Phone className="h-6 w-6 text-glacier-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-ice-900">Phone</h3>
                          <p className="text-ice-600">+1 (555) 123-4567</p>
                          <p className="text-ice-600">+1 (555) 765-4321</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-glacier-50 rounded-full p-3 mr-4">
                          <MapPin className="h-6 w-6 text-glacier-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-ice-900">Office</h3>
                          <p className="text-ice-600">123 Glacier Way</p>
                          <p className="text-ice-600">Alpine City, AC 12345</p>
                          <p className="text-ice-600">United States</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-ice-100">
                      <h3 className="text-lg font-medium text-ice-900 mb-4">Follow Us</h3>
                      <div className="flex space-x-4">
                        <a 
                          href="https://github.com/GlacierTide/GlacierTide_v2" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-ice-50 hover:bg-ice-100 transition-colors p-2 rounded-full"
                          aria-label="GitHub"
                        >
                          <svg className="h-5 w-5 text-ice-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.435 21.795 8.205 23.385C8.805 23.49 9.03 23.13 9.03 22.815C9.03 22.53 9.015 21.585 9.015 20.58C6 21.135 5.22 19.845 4.98 19.17C4.845 18.825 4.26 17.76 3.75 17.475C3.33 17.25 2.73 16.695 3.735 16.68C4.68 16.665 5.355 17.55 5.58 17.91C6.66 19.725 8.385 19.215 9.075 18.9C9.18 18.12 9.495 17.595 9.84 17.295C7.17 16.995 4.38 15.96 4.38 11.37C4.38 10.065 4.845 8.985 5.61 8.145C5.49 7.845 5.07 6.615 5.73 4.965C5.73 4.965 6.735 4.65 9.03 6.195C9.99 5.925 11.01 5.79 12.03 5.79C13.05 5.79 14.07 5.925 15.03 6.195C17.325 4.635 18.33 4.965 18.33 4.965C18.99 6.615 18.57 7.845 18.45 8.145C19.215 8.985 19.68 10.05 19.68 11.37C19.68 15.975 16.875 16.995 14.205 17.295C14.64 17.67 15.015 18.39 15.015 19.515C15.015 21.12 15 22.41 15 22.815C15 23.13 15.225 23.505 15.825 23.385C18.2072 22.5807 20.2772 21.0497 21.7437 19.0074C23.2101 16.965 23.9993 14.5143 24 12C24 5.37 18.63 0 12 0Z" fill="currentColor" />
                          </svg>
                        </a>
                        <a 
                          href="https://linkedin.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-ice-50 hover:bg-ice-100 transition-colors p-2 rounded-full"
                          aria-label="LinkedIn"
                        >
                          <svg className="h-5 w-5 text-ice-800" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452Z" fill="currentColor"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="lg:col-span-3">
                  <div className="glacier-card p-8">
                    <h2 className="text-2xl font-semibold text-ice-900 mb-6">Send a Message</h2>
                    
                    {formStatus === 'success' && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <div className="mr-3 bg-green-100 p-2 rounded-full">
                          <svg className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-green-700">Your message has been sent successfully! We'll get back to you soon.</p>
                      </div>
                    )}
                    
                    {formStatus === 'error' && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <div className="mr-3 bg-red-100 p-2 rounded-full">
                          <svg className="h-5 w-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <p className="text-red-700">Something went wrong. Please try again later.</p>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block text-ice-700 mb-2 font-medium">
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="glacier-input w-full"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-ice-700 mb-2 font-medium">
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
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="subject" className="block text-ice-700 mb-2 font-medium">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="glacier-input w-full"
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership Opportunity</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-ice-700 mb-2 font-medium">
                          Your Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="glacier-input w-full"
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="btn-primary flex items-center justify-center group"
                      >
                        Send Message
                        <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>
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

export default Contact;
