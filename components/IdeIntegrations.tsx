import React, { useState, useEffect } from 'react';
import { ideRegistry } from '../ide-config/ideRegistry';
import { mcpServerRegistry } from '../ide-config/mcpServerRegistry';
import { IdeKey, IdeDetectionStatus, IdeDetectionResult } from '../types';
import { IdeCard } from './IdeCard';
import { ManualStepsModal } from './ManualStepsModal';
import { IdeIntegrationModal } from './IdeIntegrationModal';
import { IDE_USER_RULES } from '../ide-config/ideUserRules';

const mockDetection: Record<IdeKey, IdeDetectionResult> = {
    vscode: { status: IdeDetectionStatus.Detected, version: "1.85.1", path: "~/Applications/VSCode.app" },
    cursor: { status: IdeDetectionStatus.Configured, version: "0.20.2", path: "~/Applications/Cursor.app" },
    jetbrains: { status: IdeDetectionStatus.Detected, version: "2023.3", path: "~/Applications/IntelliJ IDEA.app" },
    zed: { status: IdeDetectionStatus.NotDetected },
    windsurf: { status: IdeDetectionStatus.Detected, version: "0.5.0", path: "~/.windsurf/bin/windsurf" },
    neovim: { status: IdeDetectionStatus.ActionRequired, version: "0.9.4", path: "/usr/local/bin/nvim" },
};


export const IdeIntegrations: React.FC = () => {
    const [ideStates, setIdeStates] = useState<Partial<Record<IdeKey, IdeDetectionResult>>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);
    const [activeIdeKey, setActiveIdeKey] = useState<IdeKey | null>(null);
    const [showIntegrationModal, setShowIntegrationModal] = useState(false);

    useEffect(() => {
        // Simulate IDE detection on component mount
        setTimeout(() => {
            setIdeStates(mockDetection);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleConfigure = (ideKey: IdeKey) => {
        setIdeStates(prev => ({ ...prev, [ideKey]: { ...prev[ideKey]!, status: IdeDetectionStatus.Configured } }));
    };

    const handleOpenIntegration = (ideKey: IdeKey) => {
        setActiveIdeKey(ideKey);
        setShowIntegrationModal(true);
    };
    
    const handleShowManualSteps = (ideKey: IdeKey) => {
        const ide = ideRegistry[ideKey];
        if (ide.manualInstructions) {
            setModalContent({
                title: `${ide.label} Manual Setup`,
                content: ide.manualInstructions(ide, mcpServerRegistry)
            });
        }
    };
    
    return (
        <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">IDE Integrations</h2>
            <p className="text-slate-400 mb-6 text-sm max-w-2xl">Connect your favorite editor to the MCP Server to enable seamless AI agent collaboration. Status is auto-detected from your system.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(ideRegistry).map(([key, ide]) => (
                    <IdeCard 
                        key={key}
                        ideKey={key as IdeKey}
                        ide={ide}
                        detectionResult={ideStates[key as IdeKey]}
                        isLoading={isLoading}
                        onConfigure={handleConfigure}
                        onShowManualSteps={handleShowManualSteps}
                        onOpenIntegration={handleOpenIntegration}
                    />
                ))}
            </div>
            
            {modalContent && (
                <ManualStepsModal 
                    isOpen={!!modalContent}
                    onClose={() => setModalContent(null)}
                    title={modalContent.title}
                >
                    {modalContent.content}
                </ManualStepsModal>
            )}

            {showIntegrationModal && activeIdeKey && (
                <IdeIntegrationModal
                    isOpen={showIntegrationModal}
                    onClose={() => setShowIntegrationModal(false)}
                    ideLabel={ideRegistry[activeIdeKey].label}
                    autoConfigRenderer={
                        <div className="space-y-3">
                            <p className="text-sm text-slate-300">Click the button below to open your IDE and apply MCP configuration.</p>
                            <button
                                onClick={() => {
                                    // Placeholder: could trigger a URL handler or file write for auto configuration
                                    window.open('about:blank', '_blank');
                                }}
                                className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 font-bold py-2 px-3 rounded-md hover:bg-cyan-400 transition-colors duration-300 text-sm"
                            >
                                Apply MCP Configuration
                            </button>
                        </div>
                    }
                    manualRenderer={ideRegistry[activeIdeKey].manualInstructions?.(ideRegistry[activeIdeKey], mcpServerRegistry) || <p className="text-sm text-slate-300">No manual steps necessary.</p>}
                    userRules={IDE_USER_RULES}
                />
            )}
        </div>
    );
};
