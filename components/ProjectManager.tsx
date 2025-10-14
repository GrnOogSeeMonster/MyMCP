import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { ProjectList } from './ProjectList';
import { ProjectKanban } from './ProjectKanban';
import { SpinnerIcon } from './icons/SpinnerIcon';

export const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
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
    fetchProjects();
  }, []);

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

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-16 bg-slate-800/50 ring-1 ring-slate-700 rounded-xl">
                <SpinnerIcon className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        );
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
      <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-1">
            {selectedProject ? `Project: ${selectedProject.title}` : 'Project Manager'}
          </h2>
          <p className="text-slate-400">
            {selectedProject ? selectedProject.overview : 'Select a project to view its Kanban board.'}
          </p>
      </div>
      
      {renderContent()}
    </div>
  );
};
