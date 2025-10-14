import { McpFeature, FeatureAdoptionStatus } from '../types';

export const mcpFeatures: McpFeature[] = [
  {
    "id": "search_knowledge",
    "label": "Knowledge Search",
    "description": "Performs semantic search across the local knowledge base to find relevant documents, code snippets, and answers.",
    "endpoint": "stdio:tool:kb.search",
    "inputs": {
      "query": "string (The natural language query)",
      "filters": "object? (e.g., { type: 'technical', tags: ['react'] })"
    },
    "outputs": { "hits": "array (List of ranked search results)" },
    "ideSurfacing": ["commandPalette", "contextMenu"],
    "examples": [
      {
        "cmd": "kb.search",
        "args": { "query": "how to add mcp to zed" }
      }
    ],
    "deps": ["INDEX_PATH", "EMBED_MODEL"],
    "secrets": [],
    "env": { "INDEX_PATH": "${APP_DATA}/kb/index" },
    "validation": ["latency<1500ms", "minHits>=1 on test query", "schemaMatch"],
    "docsSlug": "features/knowledge-search",
    "risk": "Index size and embedding model can affect latency and accuracy.",
    "adoptionStatus": FeatureAdoptionStatus.Released
  },
  {
    "id": "create_project_issue",
    "label": "Create Project Issue",
    "description": "Creates a new task or issue in the connected project management board directly from the IDE.",
    "endpoint": "stdio:tool:pm.createIssue",
    "inputs": {
      "title": "string",
      "body": "string? (Markdown supported)",
      "labels": "array?",
      "priority": "string? ('High', 'Medium', 'Low')"
    },
    "outputs": { "issueId": "string", "url": "string" },
    "ideSurfacing": ["commandPalette", "codeAction"],
    "examples": [
      {
        "cmd": "pm.createIssue",
        "args": { "title": "Refactor auth module", "labels": ["tech-debt", "backend"] }
      }
    ],
    "deps": ["PM_CONNECTOR"],
    "secrets": ["PM_API_TOKEN"],
    "env": { "PM_PROJECT_ID": "MCP-1" },
    "validation": ["2xx response", "issue visible in UI"],
    "docsSlug": "features/create-issue",
    "risk": "Requires correct PM board permissions.",
    "adoptionStatus": FeatureAdoptionStatus.Validated
  },
  {
    "id": "scaffold_config_file",
    "label": "Scaffold Config File",
    "description": "Generates a boilerplate configuration file for a supported tool or framework in the current project.",
    "endpoint": "stdio:tool:project.scaffold",
    "inputs": {
      "template": "string (e.g., 'mcp.config', 'dockerfile', 'eslint')"
    },
    "outputs": { "filePath": "string" },
    "ideSurfacing": ["commandPalette"],
    "examples": [
      {
        "cmd": "project.scaffold",
        "args": { "template": "mcp.config" }
      }
    ],
    "deps": [],
    "secrets": [],
    "env": {},
    "validation": ["file is created", "file content is valid JSON/YAML"],
    "docsSlug": "features/scaffold-config",
    "adoptionStatus": FeatureAdoptionStatus.InReview
  },
  {
    "id": "get_server_status",
    "label": "Get Server Status",
    "description": "Checks the health and status of the running MCP server, including uptime and active connections.",
    "endpoint": "http:get:/status",
    "inputs": {},
    "outputs": {
      "status": "string ('Online')",
      "uptime": "number (seconds)",
      "version": "string"
    },
    "ideSurfacing": ["statusBar"],
    "examples": [
      {
        "cmd": "curl",
        "args": { "url": "http://localhost:8000/status" }
      }
    ],
    "deps": [],
    "secrets": [],
    "env": {},
    "validation": ["http status 200", "response schema match"],
    "docsSlug": "features/get-server-status",
    "risk": "Port must be accessible.",
    "adoptionStatus": FeatureAdoptionStatus.InProgress
  },
  {
    "id": "realtime_task_update",
    "label": "Real-time Task Updates",
    "description": "Subscribes to live updates from the project board, reflecting changes in the IDE as they happen.",
    "endpoint": "websocket:subscribe:pm.tasks",
    "inputs": { "projectId": "string" },
    "outputs": { "taskUpdateEvent": "object" },
    "ideSurfacing": ["backgroundService"],
    "examples": [
      { "cmd": "ws.connect", "args": { "topic": "pm.tasks" } }
    ],
    "deps": ["WEBSOCKET_SERVER"],
    "secrets": [],
    "env": {},
    "validation": ["connection established", "receives heartbeat"],
    "docsSlug": "features/realtime-tasks",
    "adoptionStatus": FeatureAdoptionStatus.Backlog
  }
];
