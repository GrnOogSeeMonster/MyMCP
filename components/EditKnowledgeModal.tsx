import React, { useState, useEffect, KeyboardEvent } from 'react';
import { KnowledgeType, KnowledgeEntry } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { XIcon } from './icons/XIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PencilIcon } from './icons/PencilIcon';

interface EditKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: KnowledgeEntry;
  onUpdate: (updatedEntry: KnowledgeEntry) => Promise<void>;
}

const MAX_TAGS = 10;

export const EditKnowledgeModal: React.FC<EditKnowledgeModalProps> = ({ isOpen, onClose, entry, onUpdate }) => {
  const [title, setTitle] = useState(entry.title);
  const [knowledgeType, setKnowledgeType] = useState<KnowledgeType>(entry.type);
  const [tags, setTags] = useState<string[]>(entry.tags);
  const [tagInput, setTagInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setTitle(entry.title);
    setKnowledgeType(entry.type);
    setTags(entry.tags);
  }, [entry]);

  const handleTagInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim() !== '') {
      e.preventDefault();
      if (tags.length < MAX_TAGS && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && tagInput === '') {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleUpdateAction = async () => {
    setIsProcessing(true);
    try {
        await onUpdate({
            ...entry,
            title,
            type: knowledgeType,
            tags,
        });
    } catch (error) {
        console.error("Failed to update entry:", error)
    } finally {
        setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const isActionButtonDisabled = isProcessing || !title.trim();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="relative bg-slate-800/80 w-full max-w-2xl rounded-xl border border-slate-700 shadow-2xl shadow-cyan-500/10 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Edit Knowledge Entry</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white" />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Knowledge Type</label>
              <div className="grid grid-cols-2 gap-4">
                <div onClick={() => setKnowledgeType(KnowledgeType.Technical)} className={`cursor-pointer p-4 rounded-lg border transition-all ${knowledgeType === KnowledgeType.Technical ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900/50 border-slate-700'}`}>
                  <CodeIcon className="w-6 h-6 mb-2 text-cyan-400" />
                  <h3 className="font-semibold text-white">Technical</h3>
                </div>
                <div onClick={() => setKnowledgeType(KnowledgeType.Business)} className={`cursor-pointer p-4 rounded-lg border transition-all ${knowledgeType === KnowledgeType.Business ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900/50 border-slate-700'}`}>
                  <BriefcaseIcon className="w-6 h-6 mb-2 text-slate-400" />
                  <h3 className="font-semibold text-white">Business</h3>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
              <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900/70 border border-slate-700 rounded-lg">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 text-sm px-2 py-1 rounded">
                    {tag}
                    <button onClick={() => removeTag(tag)}><XIcon className="w-3 h-3" /></button>
                  </span>
                ))}
                <input
                  type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagInput}
                  placeholder="+ Add tags" className="flex-1 bg-transparent outline-none text-white min-w-[100px]"
                  disabled={tags.length >= MAX_TAGS} />
              </div>
            </div>

            <button
                onClick={handleUpdateAction} disabled={isActionButtonDisabled}
                className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 font-bold py-3 px-4 rounded-md hover:bg-cyan-400 transition-all disabled:bg-slate-700 disabled:text-slate-400">
              {isProcessing ? (
                 <SpinnerIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PencilIcon className="w-5 h-5" />
              )}
              <span>{isProcessing ? 'Updating...' : 'Update Entry'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
