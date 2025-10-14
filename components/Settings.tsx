import React, { useState } from 'react';
import { View } from '../App';
import { IdeIntegrations } from './IdeIntegrations';
import { McpFeaturesManager } from './McpFeaturesManager';
import { UserRulesManager } from './UserRulesManager';
import { ReleaseNotesViewer } from './ReleaseNotesViewer';
import { CodeIcon } from './icons/CodeIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { GiftIcon } from './icons/GiftIcon';


interface SettingsProps {
    onNavigate: (view: View, context?: any) => void;
}

type SettingsTab = 'integrations' | 'features' | 'rules' | 'releases';

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('integrations');
    
    const tabItemClasses = (tab: SettingsTab) =>
    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-300 ${
      activeTab === tab
        ? 'bg-cyan-500/10 text-cyan-400'
        : 'text-slate-400 hover:bg-slate-700/50'
    }`;

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-xl p-6">
                <nav className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                    <button onClick={() => setActiveTab('integrations')} className={tabItemClasses('integrations')}>
                        <CodeIcon className="w-5 h-5" />
                        IDE Integrations
                    </button>
                    <button onClick={() => setActiveTab('features')} className={tabItemClasses('features')}>
                        <BeakerIcon className="w-5 h-5" />
                        MCP Features
                    </button>
                    <button onClick={() => setActiveTab('rules')} className={tabItemClasses('rules')}>
                        <BookOpenIcon className="w-5 h-5" />
                        User Rules
                    </button>
                    <button onClick={() => setActiveTab('releases')} className={tabItemClasses('releases')}>
                        <GiftIcon className="w-5 h-5" />
                        Release Notes
                    </button>
                </nav>

                <div>
                    {activeTab === 'integrations' && <IdeIntegrations />}
                    {activeTab === 'features' && <McpFeaturesManager onNavigate={onNavigate} />}
                    {activeTab === 'rules' && <UserRulesManager />}
                    {activeTab === 'releases' && <ReleaseNotesViewer />}
                </div>
            </div>
        </div>
    );
};