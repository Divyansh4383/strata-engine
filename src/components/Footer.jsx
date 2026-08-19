import React from 'react';
import { Layers, Terminal, Github, Heart, Shield, CheckCircle2 } from 'lucide-react';

export default function Footer({ onTriggerEasterEgg }) {
  return (
    <footer className="bg-obsidian-subtle border-t border-obsidian-border py-12 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-bold text-slate-200 text-sm tracking-wider">
                STRATA<span className="text-amber-400">.</span>ENGINE
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Zero-Lock Postgres Migrations • Acdyon Technologies Challenge 2026
              </span>
            </div>
          </div>

          {/* Center: System Status & Commit Hash */}
          <div className="flex items-center space-x-4 font-mono text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-obsidian-card border border-obsidian-border">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-semibold">ALL SYSTEMS OPERATIONAL</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-500">COMMIT: <code className="text-slate-300">#9428f1a</code></span>
          </div>

          {/* Right: Secret Easter Egg Trigger & Copyright */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onTriggerEasterEgg}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-obsidian-card border border-obsidian-border hover:border-amber-500/40 text-slate-400 hover:text-amber-400 transition-colors font-mono text-[11px]"
              title="Activate secret terminal"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Easter Egg</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 font-mono">Shipped with Craft</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
