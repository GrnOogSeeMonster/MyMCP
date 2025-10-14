import React, { useState, useEffect } from 'react';
import { Project, Task, TaskStatus, TaskPriority } from '../types';
import { FeatureAdoptionBoard } from './FeatureAdoptionBoard';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { ProjectList } from './ProjectList';
import { ProjectKanban } from './ProjectKanban';
import { SpinnerIcon } from './icons/SpinnerIcon';


type ProjectView = 'projects' | 'features';

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeView, setActiveView] = useState<ProjectView>('projects');
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'projects') {
      fetchProjects();
    }
  }, [activeView]);

  const handleSelectProject = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(project || null);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
    setSelectedProject(updatedProject);
  };

  const viewToggleClasses = (view: ProjectView) =>
    `flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md cursor-pointer transition-colors duration-200 ${
        activeView === view
        ? 'bg-slate-700 text-white'
        : 'text-slate-400 hover:bg-slate-700/50'
    }`;

  const renderContent = () => {
    if (isLoading && activeView === 'projects') {
        return (
            <div className="flex justify-center items-center p-16 bg-slate-800/50 ring-1 ring-slate-700 rounded-xl">
                <SpinnerIcon className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        );
    }

    if (activeView === 'features') {
      return <FeatureAdoptionBoard />;
    }

    if (selectedProject) {
      return (
        <ProjectKanban
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
          onUpdateProject={handleUpdateProject}
        />
      );
    }

    return (
      <ProjectList
        projects={projects}
        onSelectProject={handleSelectProject}
      />
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                {selectedProject ? `Project: ${selectedProject.title}` : 'Projects'}
              </h2>
              <p className="text-slate-400">
                {selectedProject ? selectedProject.overview : 'Select a project to view its tasks or switch to the feature board.'}
              </p>
          </div>
          <div className="flex items-center gap-2 p-1 rounded-lg bg-slate-800/50 ring-1 ring-slate-700">
            <button onClick={() => { setActiveView('projects'); setSelectedProject(null); }} className={viewToggleClasses('projects')}>
                <ClipboardListIcon className="w-5 h-5" /> All Projects
            </button>
            <button onClick={() => setActiveView('features')} className={viewToggleClasses('features')}>
                <BeakerIcon className="w-5 h-5" /> Feature Board
            </button>
          </div>
      </div>
      
      {renderContent()}
    </div>
  );
};
