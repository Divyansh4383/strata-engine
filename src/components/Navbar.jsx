import React, { useState, useEffect } from 'react';
import { Layers, Terminal, Search, ExternalLink, ChevronRight, Activity, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenCommandPalette, onTriggerEasterEgg }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-obsidian/90 backdrop-blur-md border-b border-obsidian-border py-3 shadow-2xl' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <a href="#" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 via-obsidian-card to-cyan-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors shadow-lg shadow-amber-500/10">
                <Layers className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-lg tracking-wider text-slate-100 group-hover:text-white transition-colors">
                  STRATA<span className="text-amber-400">.</span>ENGINE
                </span>
              </div>
            </a>
            
            <div className="hidden md:flex items-center space-x-2 pl-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                v2.4.1 Stable
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#sandbox" className="hover:text-amber-400 transition-colors flex items-center space-x-1">
              <span>Live Sandbox</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">Interactive</span>
            </a>
            <a href="#architecture" className="hover:text-slate-200 transition-colors">Architecture</a>
            <a href="#benchmarks" className="hover:text-slate-200 transition-colors">Benchmarks</a>
            <a href="#safety" className="hover:text-slate-200 transition-colors">Safety Model</a>
            <a href="#decisions" className="hover:text-amber-300 transition-colors text-amber-400/90 font-mono">DECISIONS.md</a>
          </nav>

          {/* Quick Actions & Command Palette Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCommandPalette}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-obsidian-card border border-obsidian-border hover:border-slate-600 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all group shadow-inner"
              title="Open Command Palette (⌘K / Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              <span>Search / Commands</span>
              <kbd className="px-1.5 py-0.5 rounded bg-obsidian-panel border border-obsidian-border text-[10px] text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={onTriggerEasterEgg}
              className="p-2 rounded-md bg-obsidian-card border border-obsidian-border hover:border-amber-500/40 text-slate-400 hover:text-amber-400 transition-colors"
              title="Secret Cyber Terminal (Konami Code)"
            >
              <Terminal className="w-4 h-4" />
            </button>

            <a
              href="#sandbox"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-obsidian font-mono text-xs font-semibold tracking-wide transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              <span>Test Sandbox</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
