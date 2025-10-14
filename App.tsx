import React, { useState } from 'react';
import { ProjectManager } from './components/ProjectManager';
import { KnowledgeBase } from './components/KnowledgeBase';
import { Settings } from './components/Settings';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { CodeIcon } from './components/icons/CodeIcon';
import { CogIcon } from './components/icons/CogIcon';

export type View = 'knowledge' | 'projects' | 'settings';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('projects');

  const navItemClasses = (view: View) => 
    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 ${
      activeView === view
        ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/50'
        : 'text-slate-400 hover:bg-slate-700/50'
    }`;
    
  const handleNavigation = (view: View, context?: any) => {
    // In a real app, context could be used to deep-link, e.g., to a specific feature doc
    setActiveView(view);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">MCP Server</h1>
            <p className="text-slate-400 text-sm">AI Agent Command & Control</p>
          </div>
          <nav className="flex items-center gap-2 p-1 rounded-lg bg-slate-800/50 ring-1 ring-slate-700">
            <div onClick={() => setActiveView('projects')} className={navItemClasses('projects')}>
              <BriefcaseIcon className="w-5 h-5" />
              Project Manager
            </div>
            <div onClick={() => setActiveView('knowledge')} className={navItemClasses('knowledge')}>
              <CodeIcon className="w-5 h-5" />
              Knowledge Base
            </div>
             <div onClick={() => setActiveView('settings')} className={navItemClasses('settings')}>
              <CogIcon className="w-5 h-5" />
              Settings
            </div>
          </nav>
        </header>

        <main>
          {activeView === 'knowledge' && <KnowledgeBase />}
          {activeView === 'projects' && <ProjectManager />}
          {activeView === 'settings' && <Settings onNavigate={handleNavigation} />}
        </main>
      </div>
    </div>
  );
};

export default App;
