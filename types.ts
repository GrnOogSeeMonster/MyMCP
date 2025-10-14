import React from 'react';

export enum KnowledgeType {
  Technical = 'technical',
  Business = 'business',
}

export enum AddMode {
  Crawl = 'crawl',
  Upload = 'upload',
}

export const CRAWL_DEPTHS = [1, 2, 3, 5] as const;
export type CrawlDepth = typeof CRAWL_DEPTHS[number];

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

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface Project {
  id: number;
  title: string;
  overview: string;
  createdAt: string; // ISO date string
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


// === IDE Integration Types ===

export type IdeKey = 'vscode' | 'cursor' | 'jetbrains' | 'zed' | 'windsurf' | 'neovim';

export enum IdeDetectionStatus {
  NotDetected = 'Not Detected',
  Detected = 'Detected',
  Configured = 'Configured',
  ActionRequired = 'Action Required',
}

export interface IdeDetectionResult {
  status: IdeDetectionStatus;
  version?: string;
  path?: string;
}

export interface IdeConfig {
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  supportsAutoConfig: boolean;
  manualInstructions?: (ide: IdeConfig, servers: McpServer[]) => React.ReactNode;
}

export type McpServerTransport = 'stdio' | 'http';

export interface McpServer {
  id: string;
  label: string;
  transport: McpServerTransport;
  command: string;
  args: string[];
  envTemplate?: Record<string, string>;
  platforms?: ('linux' | 'darwin' | 'win32')[];
}

// === MCP Feature Management Types ===

export enum FeatureStatus {
    Healthy = 'Healthy',
    Degraded = 'Degraded',
    NotConfigured = 'Not Configured',
}
  
export enum FeatureAdoptionStatus {
    Backlog = 'Backlog',
    InProgress = 'In Progress',
    InReview = 'In Review',
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