import React from 'react';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
  itemType?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemTitle, itemType = 'entry' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div
        className="relative bg-slate-800/80 w-full max-w-md rounded-xl border border-slate-700 shadow-2xl shadow-red-500/10 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Delete {itemType}?</h2>
            <p className="text-slate-400 mt-2">
              Are you sure you want to delete <strong className="text-slate-200">"{itemTitle}"</strong>? This action cannot be undone.
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={onClose}
              className="w-full bg-slate-700 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-500 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};