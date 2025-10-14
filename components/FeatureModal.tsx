import React, { useState, useEffect, KeyboardEvent } from 'react';
import { McpFeature, FeatureAdoptionStatus } from '../types';
import { XIcon } from './icons/XIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (featureData: Omit<McpFeature, 'id'> | McpFeature) => Promise<void>;
  featureToEdit?: McpFeature | null;
}

const TagInput: React.FC<{
    label: string;
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ label, tags, setTags }) => {
    const [input, setInput] = useState('');
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(input.trim())) {
                setTags([...tags, input.trim()]);
            }
            setInput('');
        } else if (e.key === 'Backspace' && input === '') {
            setTags(tags.slice(0, -1));
        }
    };
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900/70 border border-slate-700 rounded-lg">
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 text-sm px-2 py-1 rounded">
                        {tag}
                        <button onClick={() => removeTag(tag)}><XIcon className="w-3 h-3" /></button>
                    </span>
                ))}
                <input
                    type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder={`+ Add ${label.toLowerCase()}`} className="flex-1 bg-transparent outline-none text-white min-w-[120px]"
                />
            </div>
        </div>
    );
};

const JsonTextarea: React.FC<{
    label: string;
    jsonString: string;
    setJsonString: React.Dispatch<React.SetStateAction<string>>;
    error: string | null;
}> = ({ label, jsonString, setJsonString, error }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
        <textarea
            value={jsonString}
            onChange={(e) => setJsonString(e.target.value)}
            rows={4}
            className={`w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono text-xs resize-y ${error ? 'border-red-500/50' : ''}`}
            placeholder={`Enter valid JSON for ${label.toLowerCase()}`}
        ></textarea>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
);

export const FeatureModal: React.FC<FeatureModalProps> = ({ isOpen, onClose, onSave, featureToEdit }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const isEditing = !!featureToEdit;

    // Form state
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [adoptionStatus, setAdoptionStatus] = useState<FeatureAdoptionStatus>(FeatureAdoptionStatus.Backlog);
    const [docsSlug, setDocsSlug] = useState('');
    const [risk, setRisk] = useState('');

    const [inputs, setInputs] = useState('{}');
    const [outputs, setOutputs] = useState('{}');
    const [env, setEnv] = useState('{}');
    const [examples, setExamples] = useState('[]');

    const [ideSurfacing, setIdeSurfacing] = useState<string[]>([]);
    const [deps, setDeps] = useState<string[]>([]);
    const [secrets, setSecrets] = useState<string[]>([]);
    const [validation, setValidation] = useState<string[]>([]);
    
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    const resetState = () => {
        setLabel(featureToEdit?.label || '');
        setDescription(featureToEdit?.description || '');
        setEndpoint(featureToEdit?.endpoint || '');
        setAdoptionStatus(featureToEdit?.adoptionStatus || FeatureAdoptionStatus.Backlog);
        setDocsSlug(featureToEdit?.docsSlug || '');
        setRisk(featureToEdit?.risk || '');
        
        setInputs(JSON.stringify(featureToEdit?.inputs || {}, null, 2));
        setOutputs(JSON.stringify(featureToEdit?.outputs || {}, null, 2));
        setEnv(JSON.stringify(featureToEdit?.env || {}, null, 2));
        setExamples(JSON.stringify(featureToEdit?.examples || [], null, 2));

        setIdeSurfacing(featureToEdit?.ideSurfacing || []);
        setDeps(featureToEdit?.deps || []);
        setSecrets(featureToEdit?.secrets || []);
        setValidation(featureToEdit?.validation || []);
        
        setErrors({});
        setIsProcessing(false);
    }
    
    useEffect(() => {
        if (isOpen) {
            resetState();
        }
    }, [isOpen, featureToEdit]);

    const handleSave = async () => {
        setErrors({});
        let currentErrors: Record<string, string> = {};

        const parseJson = (jsonString: string, fieldName: string) => {
            try {
                return JSON.parse(jsonString);
            } catch (e) {
                currentErrors[fieldName] = `Invalid JSON in ${fieldName}`;
                return null;
            }
        };

        const parsedInputs = parseJson(inputs, 'inputs');
        const parsedOutputs = parseJson(outputs, 'outputs');
        const parsedEnv = parseJson(env, 'env');
        const parsedExamples = parseJson(examples, 'examples');

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
            return;
        }

        if (!label.trim()) {
            setErrors(prev => ({ ...prev, label: 'Label is required' }));
            return;
        }

        setIsProcessing(true);
        try {
            const featureData = {
                label, description, endpoint, adoptionStatus, docsSlug, risk,
                inputs: parsedInputs,
                outputs: parsedOutputs,
                env: parsedEnv,
                examples: parsedExamples,
                ideSurfacing, deps, secrets, validation
            };

            if (isEditing) {
                await onSave({ ...featureData, id: featureToEdit.id });
            } else {
                await onSave(featureData);
            }
            onClose();
        } catch (error) {
            console.error("Failed to save feature", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="relative bg-slate-800/80 w-full max-w-4xl rounded-xl border border-slate-700 shadow-2xl shadow-cyan-500/10 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-white text-center">{isEditing ? 'Edit MCP Feature' : 'Add New MCP Feature'}</h2>
                    <div className="mt-6 space-y-6 max-h-[75vh] overflow-y-auto pr-4">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Label</label>
                                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className={`w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white ${errors.label ? 'border-red-500/50' : ''}`} />
                                {errors.label && <p className="text-xs text-red-400 mt-1">{errors.label}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Endpoint</label>
                                <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white resize-y"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Adoption Status</label>
                                <select value={adoptionStatus} onChange={(e) => setAdoptionStatus(e.target.value as FeatureAdoptionStatus)} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white">
                                    {Object.values(FeatureAdoptionStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                               <label className="block text-sm font-medium text-slate-300 mb-2">Docs Slug</label>
                               <input type="text" value={docsSlug} onChange={(e) => setDocsSlug(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-slate-300 mb-2">Risk</label>
                               <input type="text" value={risk} onChange={(e) => setRisk(e.target.value)} className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                           </div>
                        </div>
                        
                        {/* Data Contracts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <JsonTextarea label="Inputs" jsonString={inputs} setJsonString={setInputs} error={errors.inputs} />
                            <JsonTextarea label="Outputs" jsonString={outputs} setJsonString={setOutputs} error={errors.outputs} />
                            <JsonTextarea label="Environment" jsonString={env} setJsonString={setEnv} error={errors.env} />
                            <JsonTextarea label="Examples" jsonString={examples} setJsonString={setExamples} error={errors.examples} />
                        </div>
                        
                        {/* Tag-based inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TagInput label="IDE Surfacing" tags={ideSurfacing} setTags={setIdeSurfacing} />
                            <TagInput label="Dependencies" tags={deps} setTags={setDeps} />
                            <TagInput label="Secrets" tags={secrets} setTags={setSecrets} />
                            <TagInput label="Validation" tags={validation} setTags={setValidation} />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button onClick={handleSave} disabled={isProcessing} className="flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 font-bold py-2 px-6 rounded-md hover:bg-cyan-400 transition-all disabled:bg-slate-700 disabled:text-slate-400">
                          {isProcessing ? <SpinnerIcon className="w-5 h-5 animate-spin" /> : (isEditing ? <PencilIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />)}
                          <span>{isProcessing ? 'Saving...' : (isEditing ? 'Update Feature' : 'Create Feature')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
