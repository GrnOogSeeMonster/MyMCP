export enum KnowledgeType {
  Technical = 'technical',
  Business = 'business',
}

export enum TaskStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Review = 'Review',
  Done = 'Done',
}

export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
}

export interface Project {
  id: number;
  title: string;
  overview: string;
  createdAt: string; 
  tasks: Task[];
}

export interface KnowledgeEntry {
  id: number;
  type: KnowledgeType;
  sourceType: 'crawl' | 'upload';
  source: string;
  title: string;
  tags: string[];
}

export interface AiUserRule {
    id: string;
    title: string;
    description: string;
    category: 'Style' | 'Performance' | 'Security' | 'Best Practices';
    isActive: boolean;
}
