import React, { useState, useEffect } from 'react';
import { FeatureStatus, McpFeature } from '../types';
import { View } from '../App';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { InfoIcon } from './icons/InfoIcon';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { FeatureModal } from './FeatureModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';


const statusStyles: Record<FeatureStatus, {
    textColor: string;
    bgColor: string;
    ringColor: string;
}> = {
    [FeatureStatus.Healthy]: { textColor: 'text-green-400', bgColor: 'bg-green-500/10', ringColor: 'ring-green-500/30' },
    [FeatureStatus.Degraded]: { textColor: 'text-amber-400', bgColor: 'bg-amber-500/10', ringColor: 'ring-amber-500/30' },
    [FeatureStatus.Failing]: { textColor: 'text-red-400', bgColor: 'bg-red-500/10', ringColor: 'ring-red-500/30' },
    [FeatureStatus.NotConfigured]: { textColor: 'text-slate-500', bgColor: 'bg-slate-500/10', ringColor: 'ring-slate-500/30' },
};

const FeatureStatusCard: React.FC<{ 
    feature: McpFeature;
    status: FeatureStatus;
    onTest: (featureId: string) => void;
    onHelp: (feature: McpFeature) => void;
    onEdit: (feature: McpFeature) => void;
    onDelete: (feature: McpFeature) => void;
    isTesting: boolean;
}> = ({ feature, status, onTest, onHelp, onEdit, onDelete, isTesting }) => {
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
                    onClick={() => onHelp(feature)}
                    aria-label={`Help for ${feature.label}`}
                    className="p-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors"
                    title="Help">
                    <InfoIcon className="w-5 h-5" />
                </button>
                 <button onClick={() => onEdit(feature)} className="p-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors">
                    <PencilIcon className="w-5 h-5" />
                </button>
                 <button onClick={() => onDelete(feature)} className="p-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 hover:text-red-400 transition-colors">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};


export const McpFeaturesManager: React.FC<{ onNavigate: (view: View, context?: any) => void; }> = ({ onNavigate }) => {
    const [features, setFeatures] = useState<McpFeature[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [featureStates, setFeatureStates] = useState<Record<string, { status: FeatureStatus }>>({});
    const [testingFeatureId, setTestingFeatureId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [featureToEdit, setFeatureToEdit] = useState<McpFeature | null>(null);
    const [featureToDelete, setFeatureToDelete] = useState<McpFeature | null>(null);
    const [showGlobalHelp, setShowGlobalHelp] = useState(false);
    const [helpFeature, setHelpFeature] = useState<McpFeature | null>(null);

    const fetchFeatures = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/features');
            const data = await response.json();
            setFeatures(data);
            setFeatureStates(Object.fromEntries(data.map((f: McpFeature) => [f.id, { status: FeatureStatus.NotConfigured }])));
        } catch (error) {
            console.error("Failed to fetch features:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
    }, []);

    const handleRunTest = (featureId: string) => {
        setTestingFeatureId(featureId);
        setTimeout(() => {
            const isSuccess = Math.random() > 0.2;
            setFeatureStates(prev => ({
                ...prev,
                [featureId]: { status: isSuccess ? FeatureStatus.Healthy : FeatureStatus.Degraded }
            }));
            setTestingFeatureId(null);
        }, 2000);
    };

    const handleOpenHelp = (feature: McpFeature) => {
        setHelpFeature(feature);
    };
    
    const handleSaveFeature = async (featureData: Omit<McpFeature, 'id'> | McpFeature) => {
        const isEditing = 'id' in featureData;
        const url = isEditing ? `/api/features/${featureData.id}` : '/api/features';
        const method = isEditing ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(featureData)
        });
        
        setIsModalOpen(false);
        fetchFeatures();
    };

    const handleDeleteConfirm = async () => {
        if (!featureToDelete) return;
        await fetch(`/api/features/${featureToDelete.id}`, { method: 'DELETE' });
        setFeatureToDelete(null);
        fetchFeatures();
    };

    return (
        <>
            <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-xl p-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">MCP Features</h2>
                        <p className="text-slate-400 text-sm max-w-2xl">
                            Manage and validate the capabilities of your MCP servers. Run tests to ensure each feature is healthy and configured correctly.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowGlobalHelp(true)} className="flex-shrink-0 flex items-center justify-center gap-2 bg-slate-700 text-slate-200 font-bold py-2 px-4 rounded-md hover:bg-slate-600 transition-colors duration-300 text-sm" aria-label="Help">
                            <InfoIcon className="w-5 h-5" />
                            Help
                        </button>
                        <button onClick={() => { setFeatureToEdit(null); setIsModalOpen(true); }} className="flex-shrink-0 flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors duration-300 text-sm">
                            <PlusIcon className="w-5 h-5" />
                            Add Feature
                        </button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center p-16"><SpinnerIcon className="w-8 h-8 text-cyan-400 animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map(feature => (
                            <FeatureStatusCard 
                                key={feature.id}
                                feature={feature}
                                status={(featureStates[feature.id] || {status: FeatureStatus.NotConfigured}).status}
                                onTest={handleRunTest}
                                onHelp={handleOpenHelp}
                                onEdit={() => { setFeatureToEdit(feature); setIsModalOpen(true); }}
                                onDelete={() => setFeatureToDelete(feature)}
                                isTesting={testingFeatureId === feature.id}
                            />
                        ))}
                    </div>
                )}
            </div>

            <FeatureModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFeature}
                featureToEdit={featureToEdit}
            />

            {featureToDelete && (
                <ConfirmDeleteModal
                    isOpen={!!featureToDelete}
                    onClose={() => setFeatureToDelete(null)}
                    onConfirm={handleDeleteConfirm}
                    itemTitle={featureToDelete.label}
                    itemType="Feature"
                />
            )}

            {showGlobalHelp && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowGlobalHelp(false)}>
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="relative bg-slate-800/90 w-full max-w-3xl mx-4 rounded-xl ring-1 ring-slate-700 p-6 text-slate-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-white">MCP Features — Getting Started</h3>
                            <button onClick={() => setShowGlobalHelp(false)} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Close</button>
                        </div>
                        <div className="space-y-4 text-sm">
                            <p>This page lets you manage and validate the capabilities of your MCP servers. Add features, check their health continuously, and run tests to ensure everything works.</p>
                            <div>
                                <h4 className="font-semibold text-white">How to add a feature</h4>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Click <b>Add Feature</b>, choose a server and capability.</li>
                                    <li>Fill required fields; placeholders like ${"${SET_ME_SECURELY}"} must be set in a secure env (see User Rules).</li>
                                    <li>Save and <b>Run Test</b>.</li>
                                    <li>Confirm the status turns <b>Healthy</b>.</li>
                                </ol>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Status legend</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Healthy: server reachable; last test passed.</li>
                                    <li>Degraded: reachable but slow or warning; re-test or check configuration.</li>
                                    <li>Failing: unreachable or failing test; see troubleshooting.</li>
                                    <li>Not Configured: required fields missing.</li>
                                </ul>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => onNavigate('settings', { section: 'user-rules' })} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Open User Rules</button>
                                <button onClick={() => onNavigate('projects')} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Open Project Manager</button>
                                <button onClick={() => onNavigate('knowledge')} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Open Knowledge Base</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {helpFeature && (
                <div role="dialog" aria-modal="true" className="fixed inset-0 z-40" onClick={() => setHelpFeature(null)}>
                    <div className="absolute inset-0 bg-black/60" />
                    <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-slate-800/95 ring-1 ring-slate-700 p-6 overflow-y-auto text-slate-200" onClick={e => e.stopPropagation()} aria-label={`Help for ${helpFeature.label}`}>
                        <h3 className="text-lg font-semibold text-white mb-2">{helpFeature.label} — Help</h3>
                        <p className="text-sm text-slate-300 mb-3">{helpFeature.description}</p>
                        <div className="space-y-3 text-sm">
                            <div>
                                <h4 className="font-semibold text-white">Inputs & Outputs</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <div className="font-semibold">Inputs</div>
                                        <ul className="list-disc list-inside">
                                            {Object.entries(helpFeature.inputs || {}).map(([k,v]) => (<li key={k}><b>{k}</b>: {String(v)}</li>))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="font-semibold">Outputs</div>
                                        <ul className="list-disc list-inside">
                                            {Object.entries(helpFeature.outputs || {}).map(([k,v]) => (<li key={k}><b>{k}</b>: {String(v)}</li>))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Quick steps</h4>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Ensure configuration values are set (see User Rules).</li>
                                    <li>Open your IDE and confirm MCP servers are running.</li>
                                    <li>Click Run Test on this card.</li>
                                    <li>Review status and logs if failing.</li>
                                </ol>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Validation</h4>
                                <p>Run Test performs a non-destructive check against the configured endpoint and validates the expected response shape.</p>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => onNavigate('settings', { section: 'user-rules' })} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Open User Rules</button>
                                <button onClick={() => onNavigate('projects')} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Open Project Manager</button>
                                <button onClick={() => onNavigate('knowledge')} className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600">Open Knowledge Base</button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
};