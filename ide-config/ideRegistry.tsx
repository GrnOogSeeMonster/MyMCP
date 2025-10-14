import React from 'react';
import { IdeConfig, IdeKey, McpServer } from '../types';
import { CodeBlock } from '../components/CodeBlock';

import { VscodeIcon } from '../components/icons/VscodeIcon';
import { JetbrainsIcon } from '../components/icons/JetbrainsIcon';
import { NeovimIcon } from '../components/icons/NeovimIcon';
import { ZedIcon } from '../components/icons/ZedIcon';
import { TerminalIcon } from '../components/icons/TerminalIcon';

const generateVscodeSettings = (servers: McpServer[]) => {
    const languageServers = servers.map(server => ({
        "command": [server.command, ...server.args],
        "transport": server.transport,
        "language": "*",
        "initializationOptions": {
            "label": server.label
        }
    }));

    const settingsJson = {
        "mcp.languageServers": languageServers
    };
    return JSON.stringify(settingsJson, null, 2);
};


export const ideRegistry: Record<IdeKey, IdeConfig> = {
    vscode: {
        label: "VS Code",
        Icon: VscodeIcon,
        supportsAutoConfig: true,
        manualInstructions: (ide, servers) => (
             <div className="space-y-4">
                <p>To configure MCP with VS Code, you can either use the automatic setup or add the following to your <code>settings.json</code> file:</p>
                <CodeBlock content={generateVscodeSettings(servers)} />
                <p>You may need to restart VS Code for the changes to take effect.</p>
            </div>
        ),
    },
    cursor: {
        label: "Cursor",
        Icon: VscodeIcon,
        supportsAutoConfig: true,
    },
    jetbrains: {
        label: "JetBrains",
        Icon: JetbrainsIcon,
        supportsAutoConfig: false,
         manualInstructions: (ide, servers) => (
             <div className="space-y-4">
                <p>1. Install the MCP Language Server Protocol (LSP) plugin for JetBrains IDEs.</p>
                <p>2. Open the LSP settings in your IDE (e.g., IntelliJ, PyCharm, WebStorm).</p>
                <p>3. Add a new server configuration for each MCP agent you want to use:</p>
                <ul className="list-disc list-inside space-y-2">
                    {servers.map(server => (
                        <li key={server.id}>
                            <strong>{server.label}:</strong>
                            <CodeBlock content={`Executable: ${server.command}\nArgs: ${server.args.join(' ')}`} />
                        </li>
                    ))}
                </ul>
            </div>
        ),
    },
    zed: {
        label: "Zed",
        Icon: ZedIcon,
        supportsAutoConfig: true,
        manualInstructions: (ide, servers) => (
            <div className="space-y-4">
                <p>Add the following to your Zed <code>settings.json</code> file under the <code>"language_servers"</code> key:</p>
                <CodeBlock content={JSON.stringify({
                    "mcp": {
                        "command": "node",
                        "args": ["./servers/core/dist/index.js"]
                     }
                }, null, 2)} />
                <p>Refer to Zed's documentation for adding multiple language servers.</p>
            </div>
        )
    },
    windsurf: {
        label: "Windsurf",
        Icon: TerminalIcon,
        supportsAutoConfig: false,
        manualInstructions: (ide, servers) => (
             <div className="space-y-4">
                <p>Windsurf configuration is typically done via its config file. You would add MCP as a language server.</p>
                <p>This is a placeholder for more specific instructions.</p>
            </div>
        ),
    },
    neovim: {
        label: "Neovim",
        Icon: NeovimIcon,
        supportsAutoConfig: false,
        manualInstructions: (ide, servers) => (
             <div className="space-y-4">
                <p>To configure MCP with Neovim's built-in LSP, add the following to your <code>init.lua</code> (or equivalent):</p>
                <CodeBlock content={
`-- Example for mcp-core-agent
require'lspconfig'.mcp_core.setup{
  cmd = { "${servers[0].command}", "${servers[0].args.join('", "')}" },
  filetypes = {"typescript", "javascript", "python"},
}`
                } />
                <p>You will need to create a server definition for each MCP agent you want to use. Refer to <code>lspconfig</code> documentation for more details.</p>
            </div>
        )
    },
};
