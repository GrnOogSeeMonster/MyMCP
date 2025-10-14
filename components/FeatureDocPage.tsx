import React from 'react';
import { McpFeature } from '../types';
import { CodeBlock } from './CodeBlock';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface FeatureDocPageProps {
  feature: McpFeature;
  onBack: () => void;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 mb-2">{title}</h3>
    <div className="text-slate-300 text-sm space-y-2 prose prose-sm prose-invert prose-p:my-1 prose-strong:text-slate-200 prose-code:text-cyan-300 prose-code:bg-slate-700 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
      {children}
    </div>
  </div>
);

export const FeatureDocPage: React.FC<FeatureDocPageProps> = ({ feature, onBack }) => {
  return (
    <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-xl p-6 animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-semibold mb-4">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Knowledge Base
        </button>

        <h2 className="text-2xl font-bold text-white mb-1">{feature.label}</h2>
        <p className="text-slate-400 mb-6">{feature.description}</p>
      
        <div className="space-y-6">
            <DetailSection title="Endpoint">
                <p><code>{feature.endpoint}</code></p>
            </DetailSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailSection title="Inputs">
                    <ul className="list-disc list-inside">
                        {Object.entries(feature.inputs).map(([key, value]) => (
                            <li key={key}><strong>{key}:</strong> {value}</li>
                        ))}
                    </ul>
                </DetailSection>
                 <DetailSection title="Outputs">
                    <ul className="list-disc list-inside">
                        {Object.entries(feature.outputs).map(([key, value]) => (
                            <li key={key}><strong>{key}:</strong> {value}</li>
                        ))}
                    </ul>
                </DetailSection>
            </div>

            <DetailSection title="Example Usage">
                <CodeBlock content={JSON.stringify(feature.examples[0], null, 2)} />
            </DetailSection>

            <DetailSection title="Security & Environment">
                {feature.secrets.length > 0 ? (
                    <p>This feature requires the following secret(s) to be set securely in your environment: <strong>{feature.secrets.join(', ')}</strong>. Do not store these in plaintext files.</p>
                ) : (
                    <p>This feature does not require any secrets.</p>
                )}
                 {Object.keys(feature.env).length > 0 && (
                     <p>It uses the following environment variables: <strong>{Object.keys(feature.env).join(', ')}</strong>.</p>
                 )}
            </DetailSection>
            
            {feature.risk && (
                 <DetailSection title="Notes & Risks">
                    <p>{feature.risk}</p>
                </DetailSection>
            )}
        </div>
    </div>
  );
};