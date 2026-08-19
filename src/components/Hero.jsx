import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal, Play, ArrowRight, ShieldCheck, Cpu, Zap, Activity, Database, CheckCircle2 } from 'lucide-react';

export default function Hero({ onOpenSandbox }) {
  const [copied, setCopied] = useState(false);
  const [logIndex, setLogIndex] = useState(0);

  const command = "npx strata-engine init --cluster prod-us-east";

  const telemetryLogs = [
    { time: "00:00.01", tag: "ANALYZER", msg: "Intercepted ALTER TABLE users ADD COLUMN metadata jsonb DEFAULT '{}';", status: "info" },
    { time: "00:00.04", tag: "SHADOW", msg: "Created shadow table _strata_shadow_users_v2 (0 table locks).", status: "success" },
    { time: "00:00.09", tag: "PROXY", msg: "Attached dual-write trigger & WAL replication proxy.", status: "success" },
    { time: "00:01.85", tag: "BACKFILL", msg: "Backfilled 48,291,000 rows in 965 deterministic batch chunks.", status: "amber" },
    { time: "00:01.86", tag: "CUTOVER", msg: "Swapped catalog pointer. Lock hold duration: 0.38 ms.", status: "emerald" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % telemetryLogs.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [telemetryLogs.length]);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-dot-grid">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold">STRATA 2.4 RELEASE</span>
            <span className="text-amber-500/50">•</span>
            <span className="text-slate-300">0.38ms Max Lock Hold Guarantee</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] mb-6">
            Postgres Schema Migrations Without the <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent underline decoration-amber-500/30 underline-offset-8">2 AM Lock Timeouts</span>.
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-slate-400 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            Strata intercepts raw DDL queries, provisions zero-lock shadow tables, streams continuous dual-writes, and executes microsecond atomic catalog swaps at 50,000+ QPS.
          </p>

          {/* Action Row & Copy Command */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            
            <a
              href="#sandbox"
              className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-obsidian font-mono font-bold text-sm tracking-wide transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 group active:scale-98"
            >
              <Play className="w-4 h-4 fill-obsidian" />
              <span>Launch Live Migration Sandbox</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* CLI Command Copy Pill */}
            <div className="w-full sm:w-auto flex items-center justify-between space-x-3 px-4 py-3 rounded-lg bg-obsidian-card border border-obsidian-border text-slate-300 font-mono text-xs shadow-inner">
              <div className="flex items-center space-x-2 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-500">$</span>
                <span className="text-slate-200">{command}</span>
              </div>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-obsidian-panel text-slate-400 hover:text-amber-400 transition-colors"
                title="Copy install command"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-obsidian-border/60 text-left">
            <div className="p-3.5 rounded-lg bg-obsidian-card/60 border border-obsidian-border/80">
              <div className="text-xs font-mono text-slate-400 mb-1">Max Table Lock</div>
              <div className="text-xl font-bold font-mono text-amber-400">&lt; 0.40 ms</div>
              <div className="text-[11px] text-slate-500">Atomic catalog swap</div>
            </div>
            <div className="p-3.5 rounded-lg bg-obsidian-card/60 border border-obsidian-border/80">
              <div className="text-xs font-mono text-slate-400 mb-1">Traffic Impact</div>
              <div className="text-xl font-bold font-mono text-emerald-400">0.00% Drop</div>
              <div className="text-[11px] text-slate-500">50,000 active QPS</div>
            </div>
            <div className="p-3.5 rounded-lg bg-obsidian-card/60 border border-obsidian-border/80">
              <div className="text-xs font-mono text-slate-400 mb-1">Data Backfill</div>
              <div className="text-xl font-bold font-mono text-cyan-400">Deterministic</div>
              <div className="text-[11px] text-slate-500">Chunked WAL stream</div>
            </div>
            <div className="p-3.5 rounded-lg bg-obsidian-card/60 border border-obsidian-border/80">
              <div className="text-xs font-mono text-slate-400 mb-1">Rollback SLA</div>
              <div className="text-xl font-bold font-mono text-slate-200">Instant (1-click)</div>
              <div className="text-[11px] text-slate-500">Zero data loss state</div>
            </div>
          </div>

        </div>

        {/* Hero Interactive Live Telemetry Card */}
        <div className="mt-14 max-w-4xl mx-auto rounded-xl bg-obsidian-card border border-obsidian-border shadow-2xl overflow-hidden glass-panel">
          {/* Card Header Bar */}
          <div className="px-4 py-3 bg-obsidian-panel border-b border-obsidian-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="h-4 w-px bg-obsidian-border"></div>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>prod-cluster-us-east-1a</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-semibold flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1"></span>
                  Active Proxy Engine
                </span>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-500 hidden sm:block">
              POSTGRESQL 16.2 (AWS RDS)
            </div>
          </div>

          {/* Telemetry Stream */}
          <div className="p-4 sm:p-6 font-mono text-xs space-y-3 bg-obsidian/95">
            <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-obsidian-border/50 text-[11px]">
              <span>EVENT TELEMETRY STREAM</span>
              <span>INSPECTION MODE: AUTOMATIC</span>
            </div>

            {telemetryLogs.slice(0, logIndex + 1).map((log, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-slate-300 animate-fade-in">
                <span className="text-slate-500 shrink-0">{log.time}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                  log.status === 'emerald' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  log.status === 'amber' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  log.status === 'success' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  [{log.tag}]
                </span>
                <span className="text-slate-200">{log.msg}</span>
              </div>
            ))}
          </div>

          {/* Card Footer Ticker */}
          <div className="px-4 py-2.5 bg-obsidian-panel/80 border-t border-obsidian-border flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center space-x-2">
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Current WAL Backfill Buffer: <strong className="text-slate-200">1.2 MB/s</strong></span>
            </div>
            <div className="text-amber-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>0 locks queued</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
