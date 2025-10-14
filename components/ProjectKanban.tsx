import React, { useState, useMemo } from 'react';
import { Project, Task, TaskStatus, TaskPriority } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { TaskModal } from './TaskModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const KANBAN_COLUMNS: TaskStatus[] = [TaskStatus.ToDo, TaskStatus.InProgress, TaskStatus.Review, TaskStatus.Done];

const COLUMN_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.ToDo]: 'border-slate-500',
  [TaskStatus.InProgress]: 'border-blue-500',
  [TaskStatus.Review]: 'border-purple-500',
  [TaskStatus.Done]: 'border-green-500',
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
    [TaskPriority.High]: 'border-l-red-500',
    [TaskPriority.Medium]: 'border-l-blue-500',
    [TaskPriority.Low]: 'border-l-slate-500',
};
  
const priorityOrder: Record<TaskPriority, number> = {
    [TaskPriority.High]: 1,
    [TaskPriority.Medium]: 2,
    [TaskPriority.Low]: 3,
};

const TaskCard: React.FC<{ 
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}> = ({ task, onEdit, onDelete }) => {
  return (
    <div className={`group relative bg-slate-800 p-3 rounded-md border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer animate-fade-in-up border-l-4 ${PRIORITY_COLORS[task.priority]}`}>
       <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        <button onClick={(e) => { e.stopPropagation(); onEdit(task); }} className="p-1 bg-slate-700/50 rounded-md text-slate-400 hover:bg-slate-600 hover:text-white">
          <PencilIcon className="w-4 h-4" />
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(task); }} className="p-1 bg-slate-700/50 rounded-md text-slate-400 hover:bg-slate-600 hover:text-red-400">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      <h4 className="text-sm font-semibold text-slate-100 pr-12">{task.title}</h4>
      <p className="text-xs text-slate-400 mt-1">{task.description}</p>
    </div>
  );
};

const KanbanColumn: React.FC<{ 
  status: TaskStatus; 
  tasks: Task[];
  onAddTask?: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}> = ({ status, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  return (
    <div className="flex-1 min-w-[280px] bg-slate-900/50 rounded-lg p-3">
      <div className={`flex items-center justify-between gap-2 mb-4 pb-2 border-b-2 ${COLUMN_COLORS[status]}`}>
        <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{status}</h3>
            <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        {status === TaskStatus.ToDo && onAddTask && (
            <button onClick={onAddTask} className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors">
                <PlusIcon className="w-5 h-5" />
            </button>
        )}
      </div>
      <div className="space-y-3 h-[calc(100vh-420px)] overflow-y-auto pr-1">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
      </div>
    </div>
  );
};

interface ProjectKanbanProps {
    project: Project;
    onBack: () => void;
    onUpdateProject: (updatedProject: Project) => void;
}

export const ProjectKanban: React.FC<ProjectKanbanProps> = ({ project, onBack, onUpdateProject }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');

  const handleOpenTaskModal = (task: Task | null) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: { title: string; description: string; priority: TaskPriority }) => {
    let updatedTasks: Task[];
    if (taskToEdit) {
      const response = await fetch(`/api/tasks/${taskToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskToEdit, ...taskData }),
      });
      const updatedTask = await response.json();
      updatedTasks = project.tasks.map(task => 
          task.id === taskToEdit.id ? updatedTask : task
        );
    } else {
      const response = await fetch(`/api/projects/${project.id}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const newTask = await response.json();
      updatedTasks = [newTask, ...project.tasks];
    }
    onUpdateProject({ ...project, tasks: updatedTasks });
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    await fetch(`/api/tasks/${taskToDelete.id}`, {
        method: 'DELETE',
    });
    const updatedTasks = project.tasks.filter(task => task.id !== taskToDelete.id)
    onUpdateProject({ ...project, tasks: updatedTasks });
    setTaskToDelete(null);
  };

  const filteredAndSortedTasks = useMemo(() => {
    return project.tasks
      .filter(task => priorityFilter === 'all' || task.priority === priorityFilter)
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [project.tasks, priorityFilter]);

  const priorityFilterClasses = (filter: 'all' | TaskPriority) =>
  `px-3 py-1 text-sm rounded-md cursor-pointer transition-colors duration-200 ${
    priorityFilter === filter
      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
  }`;

  return (
    <div className="animate-fade-in">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-semibold mb-4">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Projects
        </button>

        <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-lg p-2 mb-4">
            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-white flex-shrink-0 ml-2">Priority:</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setPriorityFilter('all')} className={priorityFilterClasses('all')}>All</button>
                    <button onClick={() => setPriorityFilter(TaskPriority.High)} className={priorityFilterClasses(TaskPriority.High)}>High</button>
                    <button onClick={() => setPriorityFilter(TaskPriority.Medium)} className={priorityFilterClasses(TaskPriority.Medium)}>Medium</button>
                    <button onClick={() => setPriorityFilter(TaskPriority.Low)} className={priorityFilterClasses(TaskPriority.Low)}>Low</button>
                </div>
            </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(status => (
            <KanbanColumn
                key={status}
                status={status}
                tasks={filteredAndSortedTasks.filter(task => task.status === status)}
                onAddTask={() => handleOpenTaskModal(null)}
                onEditTask={handleOpenTaskModal}
                onDeleteTask={(task) => setTaskToDelete(task)}
            />
        ))}
        </div>

        <TaskModal
            isOpen={isTaskModalOpen}
            onClose={() => setIsTaskModalOpen(false)}
            onSave={handleSaveTask}
            taskToEdit={taskToEdit}
        />
        
        {taskToDelete && (
            <ConfirmDeleteModal
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={handleDeleteTask}
                itemTitle={taskToDelete.title}
                itemType="Task"
            />
        )}
    </div>
  );
};
