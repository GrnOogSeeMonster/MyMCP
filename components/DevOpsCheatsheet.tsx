import React from 'react';
import { CodeBlock } from './CodeBlock';
import { TerminalIcon } from './icons/TerminalIcon';

const commands = {
    'Start Stack': 'docker compose --env-file .env up --build -d',
    'View Logs': 'docker compose logs -f api ui mysql',
    'Re-run Migrations': 'docker compose run --rm migrations',
    'Stop Stack': 'docker compose down',
    'Clean Database': 'docker compose down -v',
};

export const DevOpsCheatsheet: React.FC = () => {
    return (
        <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
                <TerminalIcon className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Local Docker Stack Cheatsheet</h2>
            </div>
            <p className="text-slate-400 mb-6 text-sm max-w-2xl">
                Use these commands in your terminal to manage the local development environment.
            </p>
            <div className="space-y-4">
                {Object.entries(commands).map(([title, command]) => (
                    <div key={title}>
                        <h3 className="text-sm font-semibold text-slate-300 mb-2">{title}</h3>
                        <CodeBlock content={command} />
                    </div>
                ))}
            </div>
             <div className="mt-6 text-sm text-slate-400 border-t border-slate-700 pt-4">
                <p><strong className="text-slate-200">UI URL:</strong> <a href="http://localhost:4242" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">http://localhost:4242</a></p>
                <p><strong className="text-slate-200">Health Checks:</strong> API status at <code className="text-xs bg-slate-700 p-1 rounded">/api/health</code>. Use <code className="text-xs bg-slate-700 p-1 rounded">docker compose ps</code> to check service health.</p>
            </div>
        </div>
    );
};
