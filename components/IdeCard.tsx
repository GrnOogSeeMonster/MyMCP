import React, { useState } from 'react';
import { IdeConfig, IdeKey, IdeDetectionResult, IdeDetectionStatus } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { EyeIcon } from './icons/EyeIcon';
import { CodeIcon } from './icons/CodeIcon';

interface IdeCardProps {
  ideKey: IdeKey;
  ide: IdeConfig;
  detectionResult?: IdeDetectionResult;
  isLoading: boolean;
  onConfigure: (ideKey: IdeKey) => void;
  onShowManualSteps: (ideKey: IdeKey) => void;
  onOpenIntegration: (ideKey: IdeKey) => void;
}

// status indicators removed from UI; detection state still used for button logic


export const IdeCard: React.FC<IdeCardProps> = ({ ide, detectionResult, isLoading, onConfigure, onShowManualSteps, onOpenIntegration, ideKey }) => {
    const [isActionLoading, setIsActionLoading] = useState(false);

    const handleAutoConfig = () => {
        setIsActionLoading(true);
        console.log(`Simulating auto-configuration for ${ide.label}...`);
        setTimeout(() => {
            console.log("Configuration successful.");
            onConfigure(ideKey);
            setIsActionLoading(false);
        }, 2000);
    };

    const handleValidate = () => {
        setIsActionLoading(true);
        console.log(`Simulating validation for ${ide.label}...`);
        setTimeout(() => {
             console.log("Validation successful.");
            setIsActionLoading(false);
        }, 2000);
    };
    
    if (isLoading) {
        return (
            <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-lg p-4 h-48 flex flex-col justify-between animate-pulse">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded"></div>
                    <div className="h-5 w-24 bg-slate-700 rounded"></div>
                </div>
                <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-slate-700 rounded"></div>
            </div>
        )
    }

    const { Icon } = ide;
    const status = detectionResult?.status || IdeDetectionStatus.NotDetected;

  return (
    <div className={`bg-slate-800/50 ring-1 ring-slate-700 rounded-lg p-4 flex flex-col h-48 justify-between transition-all duration-300 hover:ring-cyan-500/50`}>
        <div>
            <div className="flex items-center gap-3 mb-3">
                <Icon className="w-8 h-8 text-slate-300" />
                <h3 className="text-lg font-semibold text-white">{ide.label}</h3>
            </div>
            {/* Status indicator pill removed for cleaner UI */}
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => onOpenIntegration(ideKey)} className="w-full flex items-center justify-center gap-2 bg-slate-700 text-white font-bold py-2 px-3 rounded-md hover:bg-slate-600 transition-colors duration-300 text-sm ring-2 ring-cyan-400 shadow-lg shadow-cyan-400/30">
                MCP Configuration
            </button>
        </div>
    </div>
  );
};
