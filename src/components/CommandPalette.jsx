import React, { useState, useEffect } from 'react';
import { Search, X, Layers, Cpu, BarChart2, Terminal, FileText, ExternalLink, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onTriggerEasterEgg }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    {
      id: 'sandbox',
      title: 'Jump to Interactive Migration Sandbox',
      cat: 'Navigation',
      icon: Layers,
      action: () => {
        onClose();
        document.getElementById('sandbox')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'architecture',
      title: 'View 4-Stage Architecture Pipeline',
      cat: 'Navigation',
      icon: Cpu,
      action: () => {
        onClose();
        document.getElementById('architecture')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'benchmarks',
      title: 'Check PostgreSQL Benchmarks & CLI',
      cat: 'Navigation',
      icon: BarChart2,
      action: () => {
        onClose();
        document.getElementById('benchmarks')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'decisions',
      title: 'Read DECISIONS.md Written Explanation',
      cat: 'Documentation',
      icon: FileText,
      action: () => {
        onClose();
        document.getElementById('decisions')?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'terminal',
      title: 'Launch Secret Cyberpunk Terminal (Easter Egg)',
      cat: 'Developer Tools',
      icon: Terminal,
      action: () => {
        onClose();
        onTriggerEasterEgg();
      }
    }
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.cat.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-obsidian/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-obsidian-card border border-obsidian-border shadow-2xl overflow-hidden glass-panel">
        
        {/* Input Bar */}
        <div className="p-4 border-b border-obsidian-border flex items-center space-x-3 bg-obsidian-panel">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search section... (e.g. sandbox, terminal, decisions)"
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-obsidian-subtle text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 font-sans text-xs">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd) => {
              const IconComp = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  className="w-full p-3 rounded-xl flex items-center justify-between hover:bg-amber-500/10 hover:border-amber-500/30 border border-transparent transition-all group text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-obsidian-panel text-slate-400 group-hover:text-amber-400 transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-white">{cmd.title}</div>
                      <div className="text-[10px] font-mono text-slate-500">{cmd.cat}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 font-mono text-xs">
              No matching commands found.
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-obsidian border-t border-obsidian-border flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Navigate with mouse or click</span>
          <span className="flex items-center gap-1">
            Press <kbd className="px-1 py-0.5 rounded bg-obsidian-card border border-obsidian-border text-slate-400 text-[10px]">ESC</kbd> to close
          </span>
        </div>

      </div>
    </div>
  );
}
