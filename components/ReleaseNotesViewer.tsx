import React from 'react';
import { releaseNotes } from '../ide-config/releaseNotes';

const NoteBadge: React.FC<{ type: 'new' | 'changed' | 'breaking' | 'fixed' }> = ({ type }) => {
    const styles = {
        new: 'bg-green-500/20 text-green-300',
        changed: 'bg-blue-500/20 text-blue-300',
        breaking: 'bg-red-500/20 text-red-300',
        fixed: 'bg-purple-500/20 text-purple-300',
    };
    return (
        <span className={`inline-block mr-2 text-xs font-bold uppercase px-2 py-0.5 rounded-full ${styles[type]}`}>
            {type}
        </span>
    );
};

export const ReleaseNotesViewer: React.FC = () => {
    return (
        <div className="animate-fade-in">
            <h2 className="text-xl font-semibold text-white mb-2">Release History</h2>
            <p className="text-slate-400 mb-6 text-sm max-w-2xl">
                Track new features, updates, and bug fixes for the MCP Server.
            </p>
            <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4">
                {releaseNotes.map(release => (
                    <div key={release.version} className="relative pl-8 border-l-2 border-slate-700">
                        <div className="absolute -left-[10px] top-1 w-4 h-4 bg-slate-600 rounded-full border-4 border-slate-800"></div>
                        <p className="text-sm text-slate-500 font-medium mb-1">{release.date}</p>
                        <h3 className="text-lg font-bold text-cyan-400">Version {release.version}</h3>
                        <div className="mt-4 space-y-3 text-sm text-slate-300">
                            {release.notes.new && release.notes.new.map((note, i) => (
                                <p key={`new-${i}`}><NoteBadge type="new" />{note}</p>
                            ))}
                            {release.notes.changed && release.notes.changed.map((note, i) => (
                                <p key={`changed-${i}`}><NoteBadge type="changed" />{note}</p>
                            ))}
                             {release.notes.breaking && release.notes.breaking.map((note, i) => (
                                <p key={`breaking-${i}`}><NoteBadge type="breaking" />{note}</p>
                            ))}
                            {release.notes.fixed && release.notes.fixed.map((note, i) => (
                                <p key={`fixed-${i}`}><NoteBadge type="fixed" />{note}</p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
