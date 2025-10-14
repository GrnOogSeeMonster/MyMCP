import React, { useState, useEffect } from 'react';
import { McpFeature, FeatureAdoptionStatus } from '../types';
import { BeakerIcon } from './icons/BeakerIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

const ADOPTION_COLUMNS: FeatureAdoptionStatus[] = [
    FeatureAdoptionStatus.Backlog,
    FeatureAdoptionStatus.InProgress,
    FeatureAdoptionStatus.InReview,
    FeatureAdoptionStatus.Validated,
    FeatureAdoptionStatus.Released,
];

const COLUMN_COLORS: Record<FeatureAdoptionStatus, string> = {
  [FeatureAdoptionStatus.Backlog]: 'border-slate-500',
  [FeatureAdoptionStatus.InProgress]: 'border-blue-500',
  [FeatureAdoptionStatus.InReview]: 'border-purple-500',
  [FeatureAdoptionStatus.Validated]: 'border-amber-500',
  [FeatureAdoptionStatus.Released]: 'border-green-500',
};

const FeatureCard: React.FC<{ feature: McpFeature }> = ({ feature }) => {
  return (
    <div className="bg-slate-800 p-3 rounded-md border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer animate-fade-in-up">
      <div className="flex items-start gap-2">
        <BeakerIcon className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
        <div>
            <h4 className="text-sm font-semibold text-slate-100">{feature.label}</h4>
            <p className="text-xs text-slate-400 mt-1">{feature.description}</p>
        </div>
      </div>
    </div>
  );
};

const FeatureColumn: React.FC<{ 
  status: FeatureAdoptionStatus; 
  features: McpFeature[];
}> = ({ status, features }) => {
  return (
    <div className="flex-1 min-w-[280px] bg-slate-900/50 rounded-lg p-3">
      <div className={`flex items-center justify-between gap-2 mb-4 pb-2 border-b-2 ${COLUMN_COLORS[status]}`}>
        <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{status}</h3>
            <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{features.length}</span>
        </div>
      </div>
      <div className="space-y-3 h-[calc(100vh-320px)] overflow-y-auto pr-1">
        {features.map(feature => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
};

export const FeatureAdoptionBoard: React.FC = () => {
    const [features, setFeatures] = useState<McpFeature[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/features');
                const data = await response.json();
                setFeatures(data);
            } catch (error) {
                console.error("Failed to fetch features:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeatures();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-16">
                <SpinnerIcon className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex gap-4 overflow-x-auto pb-4">
            {ADOPTION_COLUMNS.map(status => (
                <FeatureColumn
                    key={status}
                    status={status}
                    features={features.filter(feature => feature.adoptionStatus === status)}
                />
            ))}
            </div>
        </div>
    );
};