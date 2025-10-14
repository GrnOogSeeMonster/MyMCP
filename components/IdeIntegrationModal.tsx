import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { CodeBlock } from './CodeBlock';
import { generateVscodeCursorMcpJson, generateWindsurfConfig, generateZedSettingsSnippet, generateNeovimLuaSnippet } from '../ide-config/mcpGenerators';
import { mcpServerRegistry } from '../ide-config/mcpServerRegistry';

interface IdeIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideLabel: string;
  autoConfigRenderer: React.ReactNode;
  manualRenderer: React.ReactNode;
  userRules: string;
}

export const IdeIntegrationModal: React.FC<IdeIntegrationModalProps> = ({ isOpen, onClose, ideLabel, autoConfigRenderer, manualRenderer, userRules }) => {
  const [activeTab, setActiveTab] = useState<'auto' | 'manual' | 'rules'>('auto');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="relative bg-slate-800/80 w-full max-w-3xl rounded-xl border border-slate-700 shadow-2xl shadow-cyan-500/10" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-4">{ideLabel} MCP Integration</h2>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setActiveTab('auto')} className={`px-3 py-1.5 rounded-md text-sm ${activeTab==='auto' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-200'}`}>Auto</button>
            <button onClick={() => setActiveTab('manual')} className={`px-3 py-1.5 rounded-md text-sm ${activeTab==='manual' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-200'}`}>Manual</button>
            <button onClick={() => setActiveTab('rules')} className={`px-3 py-1.5 rounded-md text-sm ${activeTab==='rules' ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-200'}`}>User Rules</button>
          </div>
          <div className="max-h-[65vh] overflow-y-auto pr-2 text-slate-200">
            {activeTab === 'auto' && (
              <div className="space-y-4">
                {autoConfigRenderer}
                <div className="mt-4 space-y-2">
                  <h3 className="text-white font-semibold">Quick Config Downloads</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DownloadBox label="VS Code / Cursor (mcp.json)" filename="mcp.json" content={generateVscodeCursorMcpJson(mcpServerRegistry)} />
                    <DownloadBox label="Windsurf (mcp_config.json)" filename="mcp_config.json" content={generateWindsurfConfig(mcpServerRegistry)} />
                    <DownloadBox label="Zed snippet (settings.json merge)" filename="zed_mcp_snippet.json" content={generateZedSettingsSnippet(mcpServerRegistry)} />
                    <DownloadBox label="Neovim (mcphub.lua snippet)" filename="mcp_neovim.lua" content={generateNeovimLuaSnippet(mcpServerRegistry)} />
                  </div>
                  <p className="text-xs text-slate-400">Use the correct OS path: VS Code/Cursor workspace .vscode/mcp.json or user MCP config; Windsurf user config path; Zed under ~/.config/zed/settings.json; Neovim add to your Lua config.</p>
                </div>
              </div>
            )}
            {activeTab === 'manual' && (
              <div className="space-y-4">
                {manualRenderer}
              </div>
            )}
            {activeTab === 'rules' && (
              <div className="space-y-4">
                <p className="text-slate-300 text-sm">Copy and paste these IDE user rules to ensure MCP-first workflows.</p>
                <CodeBlock content={userRules} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DownloadBox: React.FC<{ label: string; filename: string; content: string }> = ({ label, filename, content }) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="p-3 rounded-lg bg-slate-800/60 ring-1 ring-slate-700">
      <div className="text-sm text-slate-200 mb-2">{label}</div>
      <button onClick={handleDownload} className="w-full bg-slate-700 text-white text-sm font-semibold py-1.5 rounded-md hover:bg-slate-600 ring-2 ring-cyan-400 shadow shadow-cyan-400/30">Download</button>
    </div>
  );
};


