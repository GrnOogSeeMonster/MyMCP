import { McpServer } from '../types';

export function generateVscodeCursorMcpJson(servers: McpServer[]): string {
  const serversMap: Record<string, any> = {};
  for (const s of servers) {
    serversMap[s.id] = {
      type: s.transport,
      command: s.command,
      args: s.args,
    };
  }
  const inputs = servers
    .flatMap(s => Object.keys((s as any).envTemplate || {}))
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(name => ({ name, description: 'Set via environment or secret store' }));

  return JSON.stringify({ servers: serversMap, inputs }, null, 2);
}

export function generateWindsurfConfig(servers: McpServer[]): string {
  // Windsurf uses a user-scoped mcp_config.json; schema aligns to server definitions
  const config = {
    servers: servers.map(s => ({
      id: s.id,
      type: s.transport,
      command: s.command,
      args: s.args,
    })),
  } as any;
  return JSON.stringify(config, null, 2);
}

export function generateZedSettingsSnippet(servers: McpServer[]): string {
  // Provide a minimal snippet to merge into ~/.config/zed/settings.json
  const languageServers = Object.fromEntries(
    servers.map(s => [s.id, { command: s.command, args: s.args }])
  );
  const snippet = {
    // Add under appropriate assistant/mcp config per Zed docs
    "lsp": languageServers,
  } as any;
  return JSON.stringify(snippet, null, 2);
}

export function generateNeovimLuaSnippet(servers: McpServer[]): string {
  const lines: string[] = [];
  lines.push("-- mcphub.nvim setup snippet");
  lines.push("require('mcphub').setup({ servers = {");
  for (const s of servers) {
    const args = s.args.map(a => `'${a.replace(/'/g, "'\\''")}'`).join(', ');
    lines.push(`  { id='${s.id}', cmd='${s.command}', args={${args}} },`);
  }
  lines.push("} })");
  return lines.join("\n");
}


