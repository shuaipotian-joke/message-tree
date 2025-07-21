import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginFormProps {
  showFlag: boolean;
  setShowFlag: (showFlag: boolean) => void;
}

export interface FormData {
  usernameOrEmail: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginForm({ showFlag, setShowFlag }: Readonly<LoginFormProps>) {
  const { login, error, loading } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    usernameOrEmail: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      setShowFlag(false);
      setFormData({ usernameOrEmail: '', password: '', rememberMe: false });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">User Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-800/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded animate-shake">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Username or Email
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 transition-all duration-300"
              placeholder="Enter username or email"
            />
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 transition-all duration-300"
              placeholder="Enter password"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2 text-accent"
            />
            <label className="text-sm text-gray-600 dark:text-gray-300">
              Remember me (stay logged in for 1 month)
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn btn-primary hover-lift transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
