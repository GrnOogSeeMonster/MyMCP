import React, { useState } from 'react';
import { mcpFeatures } from '../ide-config/mcpFeatures';
import { FeatureStatus, McpFeature } from '../types';
import { View } from '../App';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CodeIcon } from './icons/CodeIcon';

const statusStyles: Record<FeatureStatus, {
    textColor: string;
    bgColor: string;
    ringColor: string;
}> = {
    [FeatureStatus.Healthy]: { textColor: 'text-green-400', bgColor: 'bg-green-500/10', ringColor: 'ring-green-500/30' },
    [FeatureStatus.Degraded]: { textColor: 'text-amber-400', bgColor: 'bg-amber-500/10', ringColor: 'ring-amber-500/30' },
    [FeatureStatus.NotConfigured]: { textColor: 'text-slate-500', bgColor: 'bg-slate-500/10', ringColor: 'ring-slate-500/30' },
};

const FeatureStatusCard: React.FC<{ 
    feature: McpFeature;
    status: FeatureStatus;
    onTest: (featureId: string) => void;
    onNavigateToDocs: (featureId: string) => void;
    isTesting: boolean;
}> = ({ feature, status, onTest, onNavigateToDocs, isTesting }) => {
    const { textColor, bgColor, ringColor } = statusStyles[status];
    return (
        <div className="bg-slate-800/60 p-4 rounded-lg ring-1 ring-slate-700 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-white">{feature.label}</h3>
                    <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ring-1 ${textColor} ${bgColor} ${ringColor}`}>
                        <span>{status}</span>
                    </div>
                </div>
                <p className="text-sm text-slate-400 mt-1">{feature.description}</p>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <button
                    onClick={() => onTest(feature.id)}
                    disabled={isTesting}
                    className="w-full flex items-center justify-center gap-2 bg-slate-700 text-slate-200 font-bold py-2 px-3 rounded-md hover:bg-slate-600 transition-colors duration-300 text-sm disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-wait"
                >
                    {isTesting ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : <BeakerIcon className="w-5 h-5" />}
                    <span>{isTesting ? 'Testing...' : 'Run Test'}</span>
                </button>
                <button 
                    onClick={() => onNavigateToDocs(feature.id)}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-500/20 text-cyan-300 font-bold py-2 px-3 rounded-md hover:bg-cyan-500/30 transition-colors duration-300 text-sm">
                    <BookOpenIcon className="w-5 h-5" />
                    <span>Open Docs</span>
                </button>
            </div>
        </div>
    );
};


export const McpFeaturesManager: React.FC<{ onNavigate: (view: View, context?: any) => void; }> = ({ onNavigate }) => {
    const [featureStates, setFeatureStates] = useState<Record<string, { status: FeatureStatus }>>(
        () => Object.fromEntries(mcpFeatures.map(f => [f.id, { status: FeatureStatus.NotConfigured }]))
    );
    const [testingFeatureId, setTestingFeatureId] = useState<string | null>(null);

    const handleRunTest = (featureId: string) => {
        setTestingFeatureId(featureId);
        // Simulate test run
        setTimeout(() => {
            const isSuccess = Math.random() > 0.2; // 80% chance of success
            setFeatureStates(prev => ({
                ...prev,
                [featureId]: { status: isSuccess ? FeatureStatus.Healthy : FeatureStatus.Degraded }
            }));
            setTestingFeatureId(null);
        }, 2000);
    };

    const handleNavigateToDocs = (featureId: string) => {
        // In a real app, you might pass the featureId in the context
        onNavigate('knowledge', { featureId });
    };

    return (
        <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-xl p-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-2">MCP Features</h2>
            <p className="text-slate-400 mb-6 text-sm max-w-2xl">
                Manage and validate the capabilities of your MCP servers. Run tests to ensure each feature is healthy and configured correctly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mcpFeatures.map(feature => (
                    <FeatureStatusCard 
                        key={feature.id}
                        feature={feature}
                        status={featureStates[feature.id].status}
                        onTest={handleRunTest}
                        onNavigateToDocs={handleNavigateToDocs}
                        isTesting={testingFeatureId === feature.id}
                    />
                ))}
            </div>
        </div>
    );
};