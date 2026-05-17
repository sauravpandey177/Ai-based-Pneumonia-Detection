import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { ModelStats } from './pages/ModelStats';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  return (
    <div className="flex bg-slate-950 min-h-screen font-sans selection:bg-blue-500/30 overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1 lg:ml-64 w-full h-screen overflow-hidden text-slate-200 relative">
         { (activeTab === 'dashboard' || activeTab === 'new') && <Dashboard /> }
         { activeTab === 'history' && <History /> }
         { activeTab === 'stats' && <ModelStats /> }
         { activeTab === 'settings' && <Settings /> }
         { activeTab === 'help' && (
           <div className="p-8"><h2 className="text-2xl font-bold mb-4">Help & Support</h2><p className="text-slate-400">Contact us at : sauravpandey177@gmail.com</p></div>
         )}
      </div>
    </div>
  );
}

export default App;
