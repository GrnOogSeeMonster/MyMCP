import { TaskStatus, TaskPriority } from '../types';

export const initialProjects = [
  { 
    id: 1, 
    title: 'MCP Server UI', 
    overview: 'Implement the main user interface for the AI Agent Command & Control center.',
    createdAt: '2024-07-29T10:00:00Z',
    tasks: [
      { id: 1, title: 'Setup project structure', description: 'Initialize repository and folder structure.', status: TaskStatus.Done, priority: TaskPriority.High },
      { id: 2, title: 'Design UI mockups', description: 'Create wireframes and high-fidelity mockups for the main views.', status: TaskStatus.Done, priority: TaskPriority.Medium },
      { id: 3, title: 'Implement Kanban UI', description: 'Build the React components for columns and cards.', status: TaskStatus.InProgress, priority: TaskPriority.High },
      { id: 4, title: 'Add live simulation logic', description: 'Use useEffect to mimic AI agent updates.', status: TaskStatus.ToDo, priority: TaskPriority.Medium },
    ]
  },
  {
    id: 2,
    title: 'Knowledge Base Crawler',
    overview: 'Develop the backend service to crawl and index documentation from various sources.',
    createdAt: '2024-07-25T14:30:00Z',
    tasks: [
        { id: 5, title: 'Choose scraping library', description: 'Evaluate Puppeteer vs. Cheerio for web crawling.', status: TaskStatus.Done, priority: TaskPriority.Medium },
        { id: 6, title: 'Design database schema', description: 'Plan the tables for storing crawled content and metadata.', status: TaskStatus.Review, priority: TaskPriority.High },
        { id: 7, title: 'Implement text chunking', description: 'Split large documents into manageable pieces for embedding.', status: TaskStatus.InProgress, priority: TaskPriority.High },
    ]
  }
];
