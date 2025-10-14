export interface ReleaseNote {
  version: string;
  date: string;
  notes: {
    new?: string[];
    changed?: string[];
    breaking?: string[];
    fixed?: string[];
  };
}

export const releaseNotes: ReleaseNote[] = [
  {
    version: "1.2.0",
    date: "2024-07-28",
    notes: {
      new: [
        "Added 'Feature Adoption Board' to the Project Manager view to track feature lifecycle.",
        "Integrated MCP Feature documentation directly into the Knowledge Base.",
        "Implemented 'User Rules' manager in Settings for AI agent behavior configuration.",
      ],
      changed: [
        "Refactored Settings into a tabbed interface for better organization.",
        "Improved Knowledge Base filtering with tag and type options.",
      ],
      fixed: [
        "Resolved module resolution error for `mcpFeatures.json` by converting it to a TypeScript module.",
      ],
    },
  },
  {
    version: "1.1.0",
    date: "2024-07-15",
    notes: {
      new: [
        "Introduced MCP Features Manager in Settings to test and validate server capabilities.",
        "Added live status detection for IDE integrations.",
      ],
      changed: [
        "Enhanced Kanban board with priority filters and a smoother drag-and-drop simulation.",
      ],
       breaking: [
        "The `mcp.validate` command signature has changed. The `report` argument is now required.",
      ],
    },
  },
  {
    version: "1.0.0",
    date: "2024-07-01",
    notes: {
      new: [
        "Initial release of the MCP Server UI.",
        "Core features include Project Manager Kanban board and Knowledge Base with crawl/upload functionality.",
      ],
    },
  },
];
