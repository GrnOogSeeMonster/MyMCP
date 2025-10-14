export enum KnowledgeType {
  Technical = 'technical',
  Business = 'business',
}

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Review = 'Review',
  Done = 'Done',
}

export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum FeatureAdoptionStatus {
    Backlog = 'Backlog',
    InProgress = 'InProgress',
    InReview = 'InReview',
    Validated = 'Validated',
    Released = 'Released',
}
  
export interface McpFeature {
    id: string;
    label: string;
    description: string;
    endpoint: string;
    inputs: Record<string, string>;
    outputs: Record<string, string>;
    ideSurfacing: string[];
    examples: { cmd: string; args: Record<string, any> }[];
    deps: string[];
    secrets: string[];
    env: Record<string, string>;
    validation: string[];
    docsSlug: string;
    risk?: string;
    adoptionStatus: FeatureAdoptionStatus; 
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