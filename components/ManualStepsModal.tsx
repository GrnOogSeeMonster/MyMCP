import React, { useEffect } from 'react';
import { XIcon } from './icons/XIcon';

interface ManualStepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const ManualStepsModal: React.FC<ManualStepsModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="relative bg-slate-800/80 w-full max-w-2xl rounded-xl border border-slate-700 shadow-2xl shadow-cyan-500/10 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-slate-400 mt-1">Follow the steps below to configure your IDE.</p>
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-4 text-slate-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
