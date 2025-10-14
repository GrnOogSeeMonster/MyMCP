import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';

export const CodeBlock: React.FC<{ content: string }> = ({ content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 ring-1 ring-slate-700">
            <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-slate-700/50 rounded-md text-slate-400 hover:bg-slate-600 hover:text-white transition-all">
                <CopyIcon className="w-5 h-5" />
            </button>
            <pre className="whitespace-pre-wrap break-words"><code>{content.trim()}</code></pre>
            {copied && <span className="absolute bottom-2 right-2 text-xs text-cyan-400 animate-fade-in-up">Copied!</span>}
        </div>
    );
};
