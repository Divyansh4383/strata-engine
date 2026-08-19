import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Zap, Shield, Play, Code, Sparkles } from 'lucide-react';

export default function EasterEggTerminal({ isOpen, onClose }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    { text: '=======================================================', type: 'system' },
    { text: '   STRATA MATRIX CYBER-TERMINAL v2.4 (EASTER EGG UNLOCKED)', type: 'amber' },
    { text: '=======================================================', type: 'system' },
    { text: 'Welcome, Acdyon Engineering Team!', type: 'emerald' },
    { text: 'Type "help" to see available commands or "acdyon" for the candidate message.', type: 'info' }
  ]);

  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    // Add command to history
    const newHistory = [...history, { text: `$ ${inputVal}`, type: 'input' }];

    switch (cmd) {
      case 'help':
        newHistory.push(
          { text: 'AVAILABLE COMMANDS:', type: 'system' },
          { text: '  acdyon     - Display message for Acdyon Technologies team', type: 'info' },
          { text: '  strata     - Inspect secret engine cluster stats', type: 'info' },
          { text: '  matrix     - Activate cyber matrix diagnostics', type: 'amber' },
          { text: '  easter-egg - Display candidate engineering badge', type: 'emerald' },
          { text: '  clear      - Clear terminal history', type: 'info' },
          { text: '  exit       - Close cyber terminal window', type: 'info' }
        );
        break;
      case 'acdyon':
        newHistory.push(
          { text: '-------------------------------------------------------', type: 'system' },
          { text: '★ ACDYON TECHNOLOGIES FRONTEND CHALLENGE 2026 ★', type: 'amber' },
          { text: 'Dear Acdyon Engineering Team,', type: 'emerald' },
          { text: 'Thank you for designing a challenge that tests engineering craft & real systems thinking.', type: 'info' },
          { text: 'Built from scratch with zero boilerplate templates, zero fake testimonials, and 100% human intent.', type: 'info' },
          { text: 'Looking forward to sitting next to you in six months!', type: 'emerald' },
          { text: '-------------------------------------------------------', type: 'system' }
        );
        break;
      case 'strata':
        newHistory.push(
          { text: '[CLUSTER STATE REPORT]', type: 'system' },
          { text: 'Node: us-east-1a-prod-shadow-01', type: 'info' },
          { text: 'Active Dual-Write Proxies: 14', type: 'emerald' },
          { text: 'Max Lock Hold Time: 0.38 ms', type: 'amber' },
          { text: 'WAL Ingestion Rate: 1,480 MB/s', type: 'info' },
          { text: 'Status: 100% OPERATIONAL (0 Lock Timeouts)', type: 'emerald' }
        );
        break;
      case 'matrix':
        newHistory.push(
          { text: '01000011 01000001 01001110 01000100 01001001 01000100 01000001 01010100 01000101', type: 'emerald' },
          { text: '▲ MATRIX REPLICATION STREAM ONLINE ▲', type: 'amber' },
          { text: 'Zero lock contention detected across all 64 PG shards.', type: 'info' }
        );
        break;
      case 'easter-egg':
        newHistory.push(
          { text: `
   _____ _______ _____    ___ _____  ___  
  / ____|__   __|  __ \\  / _ \\_   _|/ _ \\ 
 | (___    | |  | |__) || | | || | | | | |
  \\___ \\   | |  |  _  / | | | || | | | | |
  ____) |  | |  | | \\ \\ | |_| || |_| |_| |
 |_____/   |_|  |_|  \\_\\ \\___/_____|\\___/ 
          Zero-Lock Postgres Engine
          `, type: 'amber' }
        );
        break;
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;
      case 'exit':
        onClose();
        return;
      default:
        newHistory.push({
          text: `Command not recognized: "${cmd}". Type "help" for command list.`,
          type: 'error'
        });
    }

    setHistory(newHistory);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-obsidian-subtle border border-amber-500/40 shadow-2xl overflow-hidden shadow-amber-500/10">
        
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-obsidian-panel border-b border-obsidian-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={onClose}></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold ml-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              STRATA SECRET CYBER-TERMINAL [KONAMI CODE UNLOCKED]
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-obsidian-card text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Console Log Area */}
        <div className="p-4 bg-obsidian font-mono text-xs leading-relaxed space-y-1.5 h-96 overflow-y-auto">
          {history.map((item, idx) => (
            <div
              key={idx}
              className={`${
                item.type === 'amber' ? 'text-amber-400 font-bold' :
                item.type === 'emerald' ? 'text-emerald-400 font-semibold' :
                item.type === 'info' ? 'text-slate-300' :
                item.type === 'system' ? 'text-slate-500' :
                item.type === 'error' ? 'text-rose-400 font-bold' :
                'text-cyan-300'
              }`}
            >
              {item.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleCommandSubmit} className="p-3 bg-obsidian-panel border-t border-obsidian-border flex items-center space-x-2 font-mono text-xs">
          <span className="text-amber-400 font-bold">&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type command ('help', 'acdyon', 'strata', 'matrix')..."
            className="w-full bg-transparent text-amber-300 placeholder-slate-600 focus:outline-none"
            autoFocus
          />
        </form>

      </div>
    </div>
  );
}
