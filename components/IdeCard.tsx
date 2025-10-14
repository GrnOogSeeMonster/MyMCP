import React, { useState } from 'react';
import { IdeConfig, IdeKey, IdeDetectionResult, IdeDetectionStatus } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { EyeIcon } from './icons/EyeIcon';
import { CodeIcon } from './icons/CodeIcon';

interface IdeCardProps {
  ideKey: IdeKey;
  ide: IdeConfig;
  detectionResult?: IdeDetectionResult;
  isLoading: boolean;
  onConfigure: (ideKey: IdeKey) => void;
  onShowManualSteps: (ideKey: IdeKey) => void;
}

const statusStyles: Record<IdeDetectionStatus, {
    icon: React.ReactNode;
    textColor: string;
    bgColor: string;
    ringColor: string;
}> = {
    [IdeDetectionStatus.Configured]: { icon: <CheckCircleIcon className="w-4 h-4" />, textColor: 'text-green-400', bgColor: 'bg-green-500/10', ringColor: 'ring-green-500/30' },
    [IdeDetectionStatus.Detected]: { icon: <CodeIcon className="w-4 h-4" />, textColor: 'text-cyan-400', bgColor: 'bg-cyan-500/10', ringColor: 'ring-cyan-500/30' },
    [IdeDetectionStatus.ActionRequired]: { icon: <ExclamationTriangleIcon className="w-4 h-4" />, textColor: 'text-amber-400', bgColor: 'bg-amber-500/10', ringColor: 'ring-amber-500/30' },
    [IdeDetectionStatus.NotDetected]: { icon: <QuestionMarkCircleIcon className="w-4 h-4" />, textColor: 'text-slate-500', bgColor: 'bg-slate-500/10', ringColor: 'ring-slate-500/30' },
};


export const IdeCard: React.FC<IdeCardProps> = ({ ide, detectionResult, isLoading, onConfigure, onShowManualSteps, ideKey }) => {
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
    const { icon, textColor, bgColor, ringColor } = statusStyles[status];

  return (
    <div className={`bg-slate-800/50 ring-1 ring-slate-700 rounded-lg p-4 flex flex-col h-48 justify-between transition-all duration-300 hover:ring-cyan-500/50`}>
        <div>
            <div className="flex items-center gap-3 mb-3">
                <Icon className="w-8 h-8 text-slate-300" />
                <h3 className="text-lg font-semibold text-white">{ide.label}</h3>
            </div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ring-1 ${textColor} ${bgColor} ${ringColor}`}>
                {icon}
                <span>{status}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {status === IdeDetectionStatus.Detected && ide.supportsAutoConfig && (
                <button onClick={handleAutoConfig} disabled={isActionLoading} className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 font-bold py-2 px-3 rounded-md hover:bg-cyan-400 transition-colors duration-300 text-sm disabled:bg-slate-700 disabled:cursor-wait">
                    {isActionLoading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : 'Add MCP'}
                </button>
            )}

            {(status === IdeDetectionStatus.Detected || status === IdeDetectionStatus.ActionRequired) && !ide.supportsAutoConfig && (
                <button onClick={() => onShowManualSteps(ideKey)} className="w-full flex items-center justify-center gap-2 bg-slate-700 text-slate-200 font-bold py-2 px-3 rounded-md hover:bg-slate-600 transition-colors duration-300 text-sm">
                    Manual Steps
                </button>
            )}

            {status === IdeDetectionStatus.Configured && (
                 <>
                    <button onClick={handleValidate} disabled={isActionLoading} className="w-full flex items-center justify-center gap-2 bg-green-500/20 text-green-300 font-bold py-2 px-3 rounded-md hover:bg-green-500/30 transition-colors duration-300 text-sm disabled:bg-slate-700 disabled:cursor-wait">
                         {isActionLoading ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : <CheckCircleIcon className="w-5 h-5" />}
                        Validate
                    </button>
                    <button className="flex-shrink-0 p-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors">
                        <EyeIcon className="w-5 h-5" />
                    </button>
                 </>
            )}
             {status === IdeDetectionStatus.NotDetected && (
                <p className="text-xs text-slate-500 text-center w-full">Install or ensure the IDE is in your system's PATH to enable configuration.</p>
             )}
        </div>
    </div>
  );
};
