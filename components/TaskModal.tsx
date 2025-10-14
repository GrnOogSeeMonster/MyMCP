import React, { useState, useEffect } from 'react';
import { Task, TaskPriority } from '../types';
import { XIcon } from './icons/XIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: { title: string; description: string; priority: TaskPriority }) => Promise<void>;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.Medium);
  const [isProcessing, setIsProcessing] = useState(false);

  const isEditing = !!taskToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description);
        setPriority(taskToEdit.priority || TaskPriority.Medium);
      } else {
        setTitle('');
        setDescription('');
        setPriority(TaskPriority.Medium);
      }
      setIsProcessing(false);
    }
  }, [isOpen, isEditing, taskToEdit]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsProcessing(true);
    try {
        await onSave({ title, description, priority });
        onClose();
    } catch (error) {
        console.error("Failed to save task", error);
    } finally {
        setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const isActionButtonDisabled = isProcessing || !title.trim();

  const priorityButtonClasses = (p: TaskPriority) => 
    `w-full px-4 py-2 rounded-md text-center transition-all duration-300 text-sm font-semibold ${
      priority === p ? 
      {
        [TaskPriority.High]: 'bg-red-500/20 text-red-300 ring-1 ring-red-500/50',
        [TaskPriority.Medium]: 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/50',
        [TaskPriority.Low]: 'bg-slate-500/20 text-slate-300 ring-1 ring-slate-500/50',
      }[p]
      : 'bg-slate-900/50 text-slate-300 hover:bg-slate-700/50 ring-1 ring-slate-700'
    }`;


  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="relative bg-slate-800/80 w-full max-w-lg rounded-xl border border-slate-700 shadow-2xl shadow-cyan-500/10 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-white text-center">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
          <div className="space-y-6 mt-6">
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input 
                id="task-title"
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white" 
              />
            </div>

            <div>
              <label htmlFor="task-description" className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea 
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-2 text-white resize-none"
              ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setPriority(TaskPriority.High)} className={priorityButtonClasses(TaskPriority.High)}>High</button>
                    <button onClick={() => setPriority(TaskPriority.Medium)} className={priorityButtonClasses(TaskPriority.Medium)}>Medium</button>
                    <button onClick={() => setPriority(TaskPriority.Low)} className={priorityButtonClasses(TaskPriority.Low)}>Low</button>
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={isActionButtonDisabled}
                className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 font-bold py-3 px-4 rounded-md hover:bg-cyan-400 transition-all disabled:bg-slate-700 disabled:text-slate-400"
            >
              {isProcessing ? (
                 <SpinnerIcon className="w-5 h-5 animate-spin" />
              ) : isEditing ? (
                <PencilIcon className="w-5 h-5" />
              ) : (
                <PlusIcon className="w-5 h-5" />
              )}
              <span>{isProcessing ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
