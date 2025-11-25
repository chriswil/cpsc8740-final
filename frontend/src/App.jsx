import React, { useState } from 'react';
import UploadZone from './components/UploadZone';
import DocumentList from './components/DocumentList';
import Dashboard from './components/Dashboard';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'dashboard'

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <h1 className="text-xl font-bold text-gray-900">Study Assistant</h1>
          </div>
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
              aria-current={active Tab === 'dashboard' ? 'page' : undefined}
            className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
            Dashboard
          </button>
        </nav>
    </div>
      </header >

    {/* Main Content */ }
    < main className = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" >
      { activeTab === 'library' ? (
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

export default App;
