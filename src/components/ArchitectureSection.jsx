import React, { useState } from 'react';
import { Cpu, ShieldCheck, GitBranch, RefreshCw, Lock, Database, ArrowRight, CheckCircle2, Zap, AlertCircle } from 'lucide-react';

const ARCH_STAGES = [
  {
    id: 1,
    title: '01. Static DDL Safety Classifier',
    shortDesc: 'Parses SQL AST, flags AccessExclusiveLock hazards, and generates zero-downtime execution vectors.',
    icon: ShieldCheck,
    color: 'amber',
    details: {
      mechanism: 'Interception & AST Parsing',
      invariants: [
        'No direct AccessExclusiveLock allowed on production tables > 10,000 rows.',
        'Calculates lock hold window based on active connection pool capacity.',
        'Automatically rewrites blocking DDL into shadow dual-write operations.'
      ],
      codeSnippet: `// Strata AST Analyzer
const plan = strataAnalyzer.parse(sqlQuery);
if (plan.hazardScore > THRESHOLD) {
  return plan.fallbackToShadowPipeline();
}`
    }
  },
  {
    id: 2,
    title: '02. Shadow Dual-Write Injection',
    shortDesc: 'Provisions identical target schema and attaches high-throughput WAL replication triggers.',
    icon: GitBranch,
    color: 'cyan',
    details: {
      mechanism: 'Dual-Write Proxy Trigger',
      invariants: [
        'Creates _strata_shadow_<table> with new constraints.',
        'Attaches bi-directional write trigger: all incoming INSERT/UPDATE/DELETE queries replicate in real-time.',
        '0ms lock overhead on primary table read/write paths.'
      ],
      codeSnippet: `CREATE TRIGGER strata_dual_write_proxy
BEFORE INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION _strata_sync_proxy();`
    }
  },
  {
    id: 3,
    title: '03. Deterministic Batch Backfill',
    shortDesc: 'Backfills historical records in bounded 5,000-row chunks with dynamic lock-wait throttles.',
    icon: RefreshCw,
    color: 'emerald',
    details: {
      mechanism: 'Chunked WAL Streaming',
      invariants: [
        'Reads source rows using primary key ranges (min_id..max_id).',
        'Caps max lock wait at 10ms per batch: if PG lock contention rises, backfill throttles automatically.',
        'Continuous checksum verification prevents data drift between original and shadow table.'
      ],
      codeSnippet: `SELECT strata_backfill_chunk(
  source_table => 'users',
  shadow_table => '_strata_shadow_users_v2',
  chunk_size   => 5000,
  max_wait_ms  => 10
);`
    }
  },
  {
    id: 4,
    title: '04. Microsecond Atomic Swap',
    shortDesc: 'Swaps PostgreSQL catalog relation OIDs inside a 0.4ms transaction window.',
    icon: Zap,
    color: 'amber',
    details: {
      mechanism: 'Atomic Catalog Cutover',
      invariants: [
        'Acquires brief ShareRowExclusiveLock (0.38ms average).',
        'Re-names relation OIDs in pg_class atomically inside a single transaction block.',
        'Old table renamed to _strata_old_<table> for instant 1-click rollback safety.'
      ],
      codeSnippet: `BEGIN;
  LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE;
  ALTER TABLE users RENAME TO _strata_old_users;
  ALTER TABLE _strata_shadow_users_v2 RENAME TO users;
COMMIT; -- Total duration: 0.38ms`
    }
  }
];

export default function ArchitectureSection() {
  const [selectedStage, setSelectedStage] = useState(ARCH_STAGES[0]);

  return (
    <section id="architecture" className="py-20 md:py-28 bg-obsidian border-b border-obsidian-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            The 4-Stage Zero-Lock Ingestion & Cutover Pipeline
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Strata guarantees zero connection drops by replacing standard PostgreSQL table locks with deterministic shadow replication and atomic catalog swaps.
          </p>
        </div>

        {/* 4 Stage Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Stage Selector */}
          <div className="lg:col-span-6 space-y-4">
            {ARCH_STAGES.map((stage) => {
              const isSelected = selectedStage.id === stage.id;
              const IconComp = stage.icon;
              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStage(stage)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-obsidian-card border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                      : 'bg-obsidian-card/40 border-obsidian-border hover:border-slate-700 hover:bg-obsidian-card/70'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg border shrink-0 ${
                      isSelected ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-obsidian-panel text-slate-400 border-obsidian-border'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-white">{stage.title}</h3>
                        {isSelected && (
                          <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                            ACTIVE VIEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{stage.shortDesc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep Stage Inspector Panel */}
          <div className="lg:col-span-6 rounded-2xl bg-obsidian-card border border-obsidian-border p-6 shadow-2xl glass-panel space-y-6">
            
            <div className="flex items-center justify-between border-b border-obsidian-border pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <selectedStage.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedStage.title}</h4>
                  <p className="text-xs font-mono text-amber-400">{selectedStage.details.mechanism}</p>
                </div>
              </div>
            </div>

            {/* Invariants List */}
            <div>
              <h5 className="text-xs font-mono text-slate-400 font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                SAFETY GUARANTEES & INVARIANTS
              </h5>
              <ul className="space-y-2 text-xs font-sans text-slate-300">
                {selectedStage.details.invariants.map((inv, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-400 font-mono mt-0.5">•</span>
                    <span>{inv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Code Snippet Box */}
            <div>
              <h5 className="text-xs font-mono text-slate-400 font-semibold mb-2 flex items-center justify-between">
                <span>EXECUTION CODE ENGINE</span>
                <span className="text-[10px] text-slate-500">INTERNAL IMPLEMENTATION</span>
              </h5>
              <div className="p-4 rounded-lg bg-obsidian-subtle border border-obsidian-border font-mono text-xs text-amber-200/90 overflow-x-auto shadow-inner">
                <pre>{selectedStage.details.codeSnippet}</pre>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
