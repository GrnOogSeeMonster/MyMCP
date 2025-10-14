import { McpServer } from '../types';

export const mcpServerRegistry: McpServer[] = [
  {
    id: "mcp-core-agent",
    label: "MCP Core Agent",
    transport: "stdio",
    command: "node",
    args: ["./servers/core/dist/index.js"],
    envTemplate: { "MCP_API_BASE":"https://api.mcp.ai", "MCP_TOKEN":"${SET_ME_SECURELY:MCP_TOKEN}" },
    platforms: ["linux","darwin","win32"]
  },
  {
    id: "mcp-aws-helper",
    label: "MCP AWS Helper",
    transport: "stdio",
    command: "python",
    args: ["-m","mcp_aws_helper"],
    envTemplate: { "AWS_REGION":"us-east-1", "AWS_PROFILE":"default" }
  },
   {
    id: "mcp-local-knowledge",
    label: "MCP Local Knowledge Search",
    transport: "http",
    command: "node",
    args: ["./servers/knowledge/dist/index.js", "--port", "8001"],
  }
];
