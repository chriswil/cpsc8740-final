import React, { useState } from 'react';
import UploadZone from './components/UploadZone';
import DocumentList from './components/DocumentList';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';

// Inner App component to use AuthContext
function AppContent() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'dashboard'
  const { user, logout, isAuthenticated, loading, login } = useAuth();

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to Content Link - Visible on focus only */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <h1 className="text-xl font-bold text-gray-900">Study Assistant</h1>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4" aria-label="Main navigation">
              <button
                onClick={() => setActiveTab('library')}
                aria-current={activeTab === 'library' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === 'library' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Library
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Dashboard
              </button>
            </nav>

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <span className="text-sm text-gray-600 font-medium">
                {user?.username}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header >

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        {activeTab === 'library' ? (
          <div className="space-y-8">
            <section>
              <UploadZone onUploadComplete={handleUploadSuccess} />
            </section>

            <section>
              <DocumentList key={refreshTrigger} />
            </section>
          </div>
        ) : (
          <Dashboard />
        )
        }
      </main >
    </div >
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
