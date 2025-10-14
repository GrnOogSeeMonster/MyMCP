import React, { useState, useEffect } from 'react';
import { AiUserRule } from '../types';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { DevOpsCheatsheet } from './DevOpsCheatsheet';

const RuleCard: React.FC<{ rule: AiUserRule, onToggle: (id: string, isActive: boolean) => void }> = ({ rule, onToggle }) => {
    return (
        <div className="bg-slate-800/60 p-4 rounded-lg ring-1 ring-slate-700 flex items-start gap-4">
            <div className="flex-grow">
                <h3 className="font-semibold text-white">{rule.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{rule.description}</p>
                <span className="mt-2 inline-block text-xs font-medium bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{rule.category}</span>
            </div>
            <div className="flex-shrink-0">
                 <label htmlFor={`toggle-${rule.id}`} className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            id={`toggle-${rule.id}`} 
                            className="sr-only" 
                            checked={rule.isActive}
                            onChange={(e) => onToggle(rule.id, e.target.checked)}
                        />
                        <div className={`block w-14 h-8 rounded-full transition-colors ${rule.isActive ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
                        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${rule.isActive ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export const UserRulesManager: React.FC = () => {
    const [rules, setRules] = useState<AiUserRule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRules = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/rules');
            const data = await response.json();
            setRules(data);
        } catch (error) {
            console.error("Failed to fetch user rules:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleToggleRule = async (ruleId: string, isActive: boolean) => {
        // Optimistic update
        setRules(prevRules => 
            prevRules.map(rule => 
                rule.id === ruleId ? { ...rule, isActive } : rule
            )
        );

        try {
            await fetch(`/api/rules/${ruleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive })
            });
        } catch (error) {
            console.error("Failed to update rule:", error);
            // Revert on error
            fetchRules();
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-slate-800/50 ring-1 ring-slate-700 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                    <BookOpenIcon className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-xl font-semibold text-white">AI Agent Behavior Rules</h2>
                </div>
                <p className="text-slate-400 mb-6 text-sm max-w-2xl">
                    Define the coding style, patterns, and best practices you want the AI agent to follow. These rules guide code generation and modifications.
                </p>
                {isLoading ? (
                     <div className="flex justify-center items-center p-16">
                        <SpinnerIcon className="w-8 h-8 text-cyan-400 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rules.map(rule => (
                            <RuleCard key={rule.id} rule={rule} onToggle={handleToggleRule} />
                        ))}
                    </div>
                )}
            </div>
            <DevOpsCheatsheet />
        </div>
    );
};
