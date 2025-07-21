import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import AuthPanel from "./component/AuthPanel";
import LoginForm from "./component/LoginForm";
import RegisterForm from "./component/RegisterForm";
import MessageTree from "./component/MessageTree";
import MessageForm from "./component/MessageForm";
import ThemeToggle from "./component/ThemeToggle";
import config from "./config";
import './global.css';

function App() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMessageSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-primary transition-colors duration-300 overflow-auto scrollbar-overlay">
          <header className="bg-secondary shadow-secondary border-b border-primary backdrop-blur-lg">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img 
                    src="/tree.svg" 
                    alt="Tree Icon" 
                    width="32" 
                    height="32" 
                    className="text-primary"
                  />
                  <h1 className="text-2xl font-bold text-primary animate-fade-in">
                    {config.app.name}
                  </h1>
                </div>
                <div className="flex items-center space-x-4 animate-slide-in">
                  <ThemeToggle />
                  <AuthPanel 
                    showLogin={() => setShowLoginForm(true)} 
                    showRegister={() => setShowRegisterForm(true)} 
                  />
                </div>
              </div>
            </div>
          </header>
          
          <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-8">
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <MessageForm onSuccess={handleMessageSuccess} />
              </div>
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <MessageTree key={refreshTrigger} />
              </div>
            </div>
          </main>
          
          {/* Floating background elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
            <div className="absolute top-1/3 right-20 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }}></div>
            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '6s' }}></div>
          </div>
          
          <LoginForm showFlag={showLoginForm} setShowFlag={setShowLoginForm} />
          <RegisterForm showFlag={showRegisterForm} setShowFlag={setShowRegisterForm} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
