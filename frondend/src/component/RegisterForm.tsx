import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateUsername, validatePassword, validateEmail } from '../utils/validation';

interface RegisterFormProps {
  showFlag: boolean;
  setShowFlag: (showFlag: boolean) => void;
}

export default function RegisterForm({ showFlag, setShowFlag }: Readonly<RegisterFormProps>) {
  const { register, error, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: {[key: string]: string} = {};
    
    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.username = usernameError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      const success = await register(formData.username, formData.password, formData.email);
      if (success) {
        setShowFlag(false);
        setFormData({ username: '', password: '', email: '' });
        setValidationErrors({});
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  if (!showFlag) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white/90 dark:bg-gray-800/90 hover-lift shadow-xl rounded-lg p-8 w-full max-w-md mx-4 relative border border-gray-200 dark:border-gray-700 animate-bounce-in transition-all duration-300 backdrop-blur-sm max-h-[90vh] overflow-y-auto scrollbar-overlay">
        <button
          onClick={() => setShowFlag(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-xl font-bold transition-colors hover-lift bg-gray-100 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
        >
          X
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">User Registration</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded animate-shake">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 transition-all duration-300 ${
                validationErrors.username ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="5-20 characters, letters and numbers only"
            />
            {validationErrors.username && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-300">{validationErrors.username}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 transition-all duration-300 ${
                validationErrors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your email"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-300">{validationErrors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-primary text-primary placeholder-secondary transition-all duration-300 ${
                validationErrors.password ? 'border-red-500 dark:border-red-400' : 'border-primary'
              }`}
              placeholder="8-20 chars, with uppercase, lowercase, numbers and special chars"
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn btn-primary hover-lift transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}