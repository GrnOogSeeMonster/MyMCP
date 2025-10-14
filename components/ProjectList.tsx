import React from 'react';
import { Project, TaskStatus } from '../types';
import { FolderIcon } from './icons/FolderIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

const ProjectCard: React.FC<{ project: Project, onSelect: () => void }> = ({ project, onSelect }) => {
  const taskCounts = project.tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<TaskStatus, number>);

  return (
    <li 
      onClick={onSelect}
      className="bg-slate-800/50 ring-1 ring-slate-700 rounded-lg p-4 flex items-center justify-between hover:ring-cyan-500/50 hover:bg-slate-800 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="bg-slate-700 p-3 rounded-lg">
            <FolderIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{project.title}</h3>
          <p className="text-sm text-slate-400 truncate max-w-md">{project.overview}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
             <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
             <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
             <span>{project.tasks.length} Total Tasks</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-500"></div>{taskCounts[TaskStatus.ToDo] || 0} To Do</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div>{taskCounts[TaskStatus.InProgress] || 0} In Progress</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div>{taskCounts[TaskStatus.Done] || 0} Done</span>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-slate-500" />
      </div>
    </li>
  );
};


interface ProjectListProps {
  projects: Project[];
  onSelectProject: (projectId: number) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onSelectProject }) => {
  const sortedProjects = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="animate-fade-in">
      <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">All Projects</h3>
            {/* Placeholder for future "New Project" button */}
        </div>
        <ul className="space-y-3">
          {sortedProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onSelect={() => onSelectProject(project.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};