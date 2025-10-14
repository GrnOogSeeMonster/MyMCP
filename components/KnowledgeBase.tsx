import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';
import { KnowledgeType, KnowledgeEntry, McpFeature } from '../types';
import { CodeIcon } from './icons/CodeIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { DotsVerticalIcon } from './icons/DotsVerticalIcon';
import { RefreshIcon } from './icons/RefreshIcon';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { EditKnowledgeModal } from './EditKnowledgeModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { FeatureDocPage } from './FeatureDocPage';
import { BeakerIcon } from './icons/BeakerIcon';
import { AddKnowledgeModal } from './AddKnowledgeModal';


const KnowledgeEntryCard: React.FC<{ 
    entry: KnowledgeEntry;
    onEdit: (entry: KnowledgeEntry) => void;
    onDelete: (entry: KnowledgeEntry) => void;
}> = ({ entry, onEdit, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isRecrawling, setIsRecrawling] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleRecrawl = () => {
        setIsRecrawling(true);
        setIsMenuOpen(false);
        setTimeout(() => {
            setIsRecrawling(false);
        }, 3000);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
    <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-lg p-4 flex flex-col h-full hover:ring-cyan-500/50 transition-all duration-300 animate-fade-in-up">
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
                {entry.type === KnowledgeType.Technical ? <CodeIcon className="w-5 h-5 text-cyan-400" /> : <BriefcaseIcon className="w-5 h-5 text-slate-400" />}
                <span className={`text-xs font-semibold uppercase ${entry.type === KnowledgeType.Technical ? 'text-cyan-400' : 'text-slate-400'}`}>{entry.type}</span>
            </div>
             <div className="relative" ref={menuRef}>
                {isRecrawling ? (
                     <SpinnerIcon className="w-5 h-5 text-cyan-400 animate-spin" />
                ) : (
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-500 hover:text-white transition-colors">
                        <DotsVerticalIcon className="w-5 h-5" />
                    </button>
                )}
                {isMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900 ring-1 ring-slate-700 rounded-md shadow-lg z-10 animate-fade-in-up origin-top-right">
                        <div className="py-1">
                             {entry.sourceType === 'crawl' && (
                                <button onClick={handleRecrawl} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                                    <RefreshIcon className="w-4 h-4" />
                                    Re-crawl
                                </button>
                            )}
                            <button onClick={() => { onEdit(entry); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                                <PencilIcon className="w-4 h-4" />
                                Edit
                            </button>
                            <div className="border-t border-slate-700/50 my-1"></div>
                            <button onClick={() => { onDelete(entry); setIsMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-slate-800">
                                <TrashIcon className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <h3 className="font-semibold text-white mb-1 flex-grow">{entry.title}</h3>
        <p className="text-xs text-slate-500 truncate mb-3 flex items-center gap-1.5">
            {entry.sourceType === 'crawl' ? <GlobeIcon className="w-3 h-3" /> : <BriefcaseIcon className="w-3 h-3" />}
            {entry.source}
        </p>
        <div className="flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                    #{tag}
                </span>
            ))}
            {entry.tags.length > 3 && <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">+{entry.tags.length - 3} more</span>}
        </div>
    </div>
    )
};


export const KnowledgeBase: React.FC<{}> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [features, setFeatures] = useState<McpFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | KnowledgeType>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<KnowledgeEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<KnowledgeEntry | null>(null);

  const fetchData = async () => {
    try {
        setIsLoading(true);
        const [entriesRes, featuresRes] = await Promise.all([
            fetch('/api/knowledge'),
            fetch('/api/features')
        ]);
        const entriesData = await entriesRes.json();
        const featuresData = await featuresRes.json();
        setEntries(entriesData);
        setFeatures(featuresData);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    entries.forEach(entry => {
      entry.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return entries
      .filter(entry => typeFilter === 'all' || entry.type === typeFilter)
      .filter(entry => !selectedTag || entry.tags.includes(selectedTag))
      .filter(entry => 
        searchQuery.trim() === '' ||
        entry.title.toLowerCase().includes(lowerCaseQuery) ||
        entry.source.toLowerCase().includes(lowerCaseQuery) ||
        entry.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
  }, [entries, typeFilter, selectedTag, searchQuery]);

  const handleAddEntry = async (newEntryData: Omit<KnowledgeEntry, 'id'>) => {
    const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntryData)
    });
    if (response.ok) {
        fetchData();
    }
  };

  const handleUpdateEntry = async (updatedEntry: KnowledgeEntry) => {
    const response = await fetch(`/api/knowledge/${updatedEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEntry)
    });
    if (response.ok) {
        fetchData();
    }
    setEntryToEdit(null);
  };

  const handleDeleteEntry = async () => {
    if (!entryToDelete) return;
    const response = await fetch(`/api/knowledge/${entryToDelete.id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        fetchData();
    }
    setEntryToDelete(null);
  };

  const typeFilterClasses = (filter: 'all' | KnowledgeType) =>
    `px-3 py-1 text-sm rounded-md cursor-pointer transition-colors duration-200 ${
      typeFilter === filter
        ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
    }`;

  const tagFilterClasses = (tag: string | null) =>
    `text-xs font-medium px-2.5 py-1 rounded-full cursor-pointer transition-colors duration-200 ${
      selectedTag === tag
        ? 'bg-cyan-500/80 text-white ring-1 ring-cyan-400'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
    }`;

  const selectedFeature = useMemo(() => {
    return features.find(f => f.id === selectedFeatureId);
  }, [selectedFeatureId, features]);
  
  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-16">
                <SpinnerIcon className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        );
    }
    if (entries.length === 0) {
        return (
            <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Knowledge Base is Empty</h2>
                <p className="text-slate-400 mb-6">Start by adding your first knowledge source.</p>
            </div>
        );
    }
    if (filteredEntries.length === 0) {
        return (
            <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">No Results Found</h2>
                <p className="text-slate-400">Try adjusting your search query or filters.</p>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEntries.map(entry => 
                <KnowledgeEntryCard 
                    key={entry.id} 
                    entry={entry} 
                    onEdit={() => setEntryToEdit(entry)}
                    onDelete={() => setEntryToDelete(entry)}
                />
            )}
        </div>
    );
  }

  return (
    <div className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3">
                <div className="sticky top-8">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full mb-6 inline-flex items-center justify-center gap-2 bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition-colors duration-300 shadow-lg shadow-cyan-500/20"
                        >
                        <PlusIcon className="w-5 h-5" />
                        Add Knowledge
                    </button>
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <BeakerIcon className="w-5 h-5 text-cyan-400" />
                        MCP Features
                    </h3>
                    <nav className="space-y-1">
                        {features.map(feature => (
                             <a
                                key={feature.id}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setSelectedFeatureId(feature.id); }}
                                className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                    selectedFeatureId === feature.id
                                    ? 'bg-slate-700/80 text-white font-semibold'
                                    : 'text-slate-400 hover:bg-slate-800/50'
                                }`}
                            >
                                {feature.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </aside>
            <main className="lg:col-span-9">
                {selectedFeature ? (
                     <FeatureDocPage feature={selectedFeature} onBack={() => setSelectedFeatureId(null)} />
                ) : (
                    <>
                        <div className="relative w-full mb-4">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search knowledge base entries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900/70 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>
                        
                        <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-lg p-4 mb-6 space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <span className="text-sm font-semibold text-white flex-shrink-0">Type:</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setTypeFilter('all')} className={typeFilterClasses('all')}>All</button>
                                    <button onClick={() => setTypeFilter(KnowledgeType.Technical)} className={typeFilterClasses(KnowledgeType.Technical)}>Technical</button>
                                    <button onClick={() => setTypeFilter(KnowledgeType.Business)} className={typeFilterClasses(KnowledgeType.Business)}>Business</button>
                                </div>
                            </div>
                            <div className="border-t border-slate-700/50"></div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-4">
                                <span className="text-sm font-semibold text-white flex-shrink-0">Tags:</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    <button onClick={() => setSelectedTag(null)} className={tagFilterClasses(null)}>All Tags</button>
                                    {allTags.map(tag => (
                                        <button key={tag} onClick={() => setSelectedTag(tag)} className={tagFilterClasses(tag)}>
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {renderContent()}
                    </>
                )}
            </main>
        </div>

        <AddKnowledgeModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddEntry}
        />
        
        {entryToEdit && (
            <EditKnowledgeModal
                isOpen={!!entryToEdit}
                onClose={() => setEntryToEdit(null)}
                entry={entryToEdit}
                onUpdate={handleUpdateEntry}
            />
        )}

        {entryToDelete && (
            <ConfirmDeleteModal
                isOpen={!!entryToDelete}
                onClose={() => setEntryToDelete(null)}
                onConfirm={handleDeleteEntry}
                itemTitle={entryToDelete.title}
                itemType="Entry"
            />
        )}
    </div>
  );
};