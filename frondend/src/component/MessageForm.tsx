import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { messageApi } from '../utils/api';
import { validateMessageContent, getCharacterCount } from '../utils/validation';

interface MessageFormProps {
  parentId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export default function MessageForm({ parentId, onSuccess, onCancel, placeholder }: MessageFormProps) {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { used, remaining } = getCharacterCount(content);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateMessageContent(content);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await messageApi.createMessage({
        content,
        parentId,
      });
      
      setContent('');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setContent(value);
      setError(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-tertiary glass border border-primary rounded-lg p-4 mb-6 animate-bounce-in">
        <p className="text-accent text-center font-medium">
          Please login to post a message
        </p>
      </div>
    );
  }

  return (
    <div className="bg-secondary glass shadow-secondary hover-lift rounded-lg p-6 mb-6 border border-primary animate-fade-in">
      <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
        {parentId ? 'Reply to message' : 'Post new message'}
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded animate-shake">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={handleChange}
            placeholder={placeholder || "Share your thoughts..."}
            className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none bg-primary text-primary placeholder-secondary transition-all duration-300 hover:border-secondary focus:border-secondary scrollbar-overlay"
            rows={4}
          />
          <div className="flex justify-between items-center mt-2">
            <span className={`text-sm font-medium ${remaining < 0 ? 'text-red-500' : remaining < 20 ? 'text-orange-500' : 'text-secondary'}`}>
              {used}/200 characters ({remaining} remaining)
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || content.length < 3 || content.length > 200}
            className={`btn btn-primary hover-lift transition-all duration-300 ${
              loading || content.length < 3 || content.length > 200 
                ? 'opacity-50 cursor-not-allowed' 
                : 'animate-pulse'
            }`}
          >
            {loading ? 'Sending...' : parentId ? 'Reply' : 'Post'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary hover-lift"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
