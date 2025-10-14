import React, { useState, useEffect, KeyboardEvent, DragEvent } from 'react';
import { KnowledgeType, AddMode, CRAWL_DEPTHS, CrawlDepth, KnowledgeEntry } from '../types';
import { GlobeIcon } from './icons/GlobeIcon';
import { UploadIcon } from './icons/UploadIcon';
import { CodeIcon } from './icons/CodeIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { InfoIcon } from './icons/InfoIcon';
import { XIcon } from './icons/XIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { FileIcon } from './icons/FileIcon';

interface AddKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: Omit<KnowledgeEntry, 'id'>) => Promise<void>;
}

const MAX_TAGS = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf', 
  'text/plain', 
  'text/markdown', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const AddKnowledgeModal: React.FC<AddKnowledgeModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [addMode, setAddMode] = useState<AddMode>(AddMode.Crawl);
  const [knowledgeType, setKnowledgeType] = useState<KnowledgeType>(KnowledgeType.Technical);
  const [sourceUrl, setSourceUrl] = useState('');
  const [crawlDepth, setCrawlDepth] = useState<CrawlDepth>(2);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resetState = () => {
    setAddMode(AddMode.Crawl);
    setKnowledgeType(KnowledgeType.Technical);
    setSourceUrl('');
    setCrawlDepth(2);
    setTags([]);
    setTagInput('');
    setIsProcessing(false);
    setUploadedFile(null);
    setUploadError(null);
  }

  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

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
  
  const handleProcessAction = async () => {
    setIsProcessing(true);
    try {
        const source = addMode === AddMode.Crawl ? sourceUrl : uploadedFile!.name;
        const title = addMode === AddMode.Crawl ? `Crawled: ${new URL(sourceUrl).hostname}` : uploadedFile!.name;
        
        const newEntry: Omit<KnowledgeEntry, 'id'> = {
            title,
            type: knowledgeType,
            sourceType: addMode,
            source,
            tags
        };
        await onAdd(newEntry);
        onClose();
    } catch (error) {
        console.error("Failed to add knowledge entry:", error);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    setUploadError(null);
    setUploadedFile(null);

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File is too large. Maximum size is 10MB.');
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setUploadError('Invalid file type. Please upload PDF, DOCX, TXT, or MD.');
      return;
    }

    setUploadedFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  if (!isOpen) return null;

  const actionButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <SpinnerIcon className="w-5 h-5 animate-spin" />
          <span>{addMode === AddMode.Crawl ? 'Crawling...' : 'Uploading...'}</span>
        </>
      );
    }
    return addMode === AddMode.Crawl ? 'Start Crawling' : 'Add Document';
  };

  const isActionButtonDisabled = isProcessing || 
    (addMode === AddMode.Upload && !uploadedFile) ||
    (addMode === AddMode.Crawl && !sourceUrl.trim());


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
          <h2 className="text-2xl font-bold text-white text-center">Add Knowledge</h2>
          <div className="flex justify-center items-center gap-2 my-6 bg-slate-900/50 p-1 rounded-lg">
            <button onClick={() => setAddMode(AddMode.Crawl)} className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-300 ${addMode === AddMode.Crawl ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
              <GlobeIcon className="w-5 h-5" /> Crawl Website
            </button>
            <button onClick={() => setAddMode(AddMode.Upload)} className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm transition-all duration-300 ${addMode === AddMode.Upload ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>
              <UploadIcon className="w-5 h-5" /> Upload Document
            </button>
          </div>

          <div className="space-y-6">
            {addMode === AddMode.Crawl ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
                  <input type="text" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://docs.example.com" className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Crawl Depth</label>
                  <div className="grid grid-cols-4 gap-2">
                    {CRAWL_DEPTHS.map(depth => (
                      <button key={depth} onClick={() => setCrawlDepth(depth)} className={`px-4 py-2 rounded-md transition-all ${crawlDepth === depth ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900/50 text-slate-300'}`}>
                        {depth}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
                <label 
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-900/50 transition-all ${isDragging ? 'border-cyan-500' : ''} ${uploadError ? 'border-red-500/50' : ''}`}>
                    {uploadedFile ? (
                      <div className="text-center">
                        <FileIcon className="w-12 h-12 mx-auto mb-2 text-cyan-400" />
                        <p className="font-semibold text-white">{uploadedFile.name}</p>
                        <button onClick={(e) => { e.preventDefault(); setUploadedFile(null); }} className="mt-2 text-xs text-red-400">Remove</button>
                      </div>
                    ) : (
                      <div className="text-center">
                          {uploadError ? <p className="text-red-400">{uploadError}</p> : <><UploadIcon className="w-10 h-10 mx-auto mb-2 text-slate-500"/><p>Drag & drop or click to upload</p><p className="text-xs text-slate-500">PDF, DOCX, TXT, MD (MAX. 10MB)</p></>}
                      </div>
                    )}
                    <input type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                </label>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Knowledge Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setKnowledgeType(KnowledgeType.Technical)} className={`p-4 rounded-lg border transition-all ${knowledgeType === KnowledgeType.Technical ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900/50 border-slate-700'}`}>
                  <CodeIcon className="w-6 h-6 mb-1 text-cyan-400" />
                  <h3 className="font-semibold text-white">Technical</h3>
                </button>
                <button onClick={() => setKnowledgeType(KnowledgeType.Business)} className={`p-4 rounded-lg border transition-all ${knowledgeType === KnowledgeType.Business ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900/50 border-slate-700'}`}>
                  <BriefcaseIcon className="w-6 h-6 mb-1 text-slate-400" />
                  <h3 className="font-semibold text-white">Business</h3>
                </button>
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
                onClick={handleProcessAction} disabled={isActionButtonDisabled}
                className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 font-bold py-3 rounded-md hover:bg-cyan-400 transition-all disabled:bg-slate-700 disabled:text-slate-400">
              {actionButtonContent()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
