import { useAuth } from "../context/AuthContext";

interface AuthPanelProps {
  showLogin: () => void;
  showRegister: () => void;
}

export default function AuthPanel({ showLogin, showRegister }: Readonly<AuthPanelProps>) {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {isAuthenticated ? (
        <div className="flex items-center gap-4 animate-fade-in">
          <div className="text-sm text-secondary">
            <span className="font-medium text-primary">{user?.username}</span>
            <span className="ml-2">({user?.email})</span>
          </div>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary hover-lift text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-2 animate-fade-in">
          <button 
            onClick={showLogin}
            className="btn btn-primary hover-lift text-sm"
          >
            Login
          </button>
          <button 
            onClick={showRegister}
            className="btn btn-secondary hover-lift text-sm"
          >
            Register
          </button>
        </div>
      )}
    </>
  );
}
