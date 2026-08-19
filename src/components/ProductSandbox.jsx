import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Shield, Database, Zap, Code2, AlertTriangle, CheckCircle2, FileCode, Layers, ArrowRight, BarChart3, Clock } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'add-column',
    title: 'Add NOT NULL Column',
    table: 'users (48,200,000 records)',
    standardSql: `ALTER TABLE users \n  ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT false;`,
    standardEffect: 'Takes AccessExclusiveLock on whole table. Blocks all SELECT/INSERT/UPDATE queries for ~42 seconds.',
    standardLockMs: 42100,
    strataLockMs: 0.38,
    strataPlanSql: `-- Strata Engine Zero-Lock Migration Plan
1. CREATE TABLE _strata_shadow_users_v2 (LIKE users INCLUDING ALL);
2. ALTER TABLE _strata_shadow_users_v2 ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT false;
3. ATTACH DUAL_WRITE_TRIGGER(users -> _strata_shadow_users_v2);
4. EXECUTE BATCH_BACKFILL(chunk_size=5000, max_pg_lock_wait=10ms);
5. BEGIN; LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE; -- 0.38ms swap
   ALTER TABLE users RENAME TO _strata_old_users;
   ALTER TABLE _strata_shadow_users_v2 RENAME TO users;
   COMMIT;`,
    steps: [
      { name: '1. Safety Audit', desc: 'Validates DDL lock hazard score: LOW (Shadow path safe)', duration: 300 },
      { name: '2. Shadow Schema Provisioning', desc: 'Created _strata_shadow_users_v2 with default expression', duration: 400 },
      { name: '3. Dual-Write Proxy Injection', desc: 'Streaming live WAL changes to shadow buffer', duration: 600 },
      { name: '4. Chunked Deterministic Backfill', desc: 'Backfilled 48,200,000 rows in 964 batches (0ms lock)', duration: 1200 },
      { name: '5. Microsecond Catalog Swap', desc: 'Swapped catalog pointers. Hold duration: 0.38ms. Complete!', duration: 300 },
    ]
  },
  {
    id: 'rename-column',
    title: 'Rename Production Column',
    table: 'orders (120,500,000 records)',
    standardSql: `ALTER TABLE orders \n  RENAME COLUMN legacy_hash TO auth_hash_v2;`,
    standardEffect: 'Instantly breaks active API workers querying legacy_hash. Requires scheduled maintenance window.',
    standardLockMs: 18400,
    strataLockMs: 0.42,
    strataPlanSql: `-- Strata Engine Zero-Downtime Rename Plan
1. ALTER TABLE orders ADD COLUMN auth_hash_v2 text;
2. CREATE TRIGGER sync_orders_auth_hash BEFORE INSERT OR UPDATE ON orders...
3. EXECUTE CHUNKED_COPY(orders.legacy_hash -> orders.auth_hash_v2);
4. ATTACH READ_DEPRECATION_SHIM(orders.legacy_hash => orders.auth_hash_v2);
5. DEPRECATE legacy_hash AFTER 7-DAY APPLICATION CUTOVER WINDOW;`,
    steps: [
      { name: '1. Safety Audit', desc: 'Identified 14 dependent API queries. Injecting proxy shims.', duration: 300 },
      { name: '2. Add Target Column', desc: 'Added auth_hash_v2 column (0s lock)', duration: 400 },
      { name: '3. Attach Dual-Write Sync', desc: 'Bi-directional trigger keeping legacy & new column synced', duration: 500 },
      { name: '4. Async Value Copy', desc: 'Migrated 120.5M values in background WAL stream', duration: 1400 },
      { name: '5. Deprecation Proxy Ready', desc: 'Both columns active. Zero downtime achieved!', duration: 300 },
    ]
  },
  {
    id: 'index-hot-table',
    title: 'Index Hot Table',
    table: 'financial_transactions (210M rows)',
    standardSql: `CREATE INDEX idx_txn_user_id ON transactions (user_id);`,
    standardEffect: 'Lock table against writes during index build. Causes HTTP 504 timeouts across checkout flow.',
    standardLockMs: 89000,
    strataLockMs: 0.29,
    strataPlanSql: `-- Strata Engine Guarded Index Construction
1. CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_txn_user_id 
   ON transactions (user_id) WITH (max_parallel_workers=4);
2. MONITOR PG_STAT_PROGRESS_CREATE_INDEX FOR DEADBAND LATENCY;
3. IF (pg_active_locks > threshold) THROTTLE_INDEX_BUILD_WORKERS();
4. VALIDATE INDEX INTEGRITY & MARK VALID;`,
    steps: [
      { name: '1. Lock Hazard Audit', desc: 'Standard CREATE INDEX lock hazard detected. Switching to CONCURRENTLY.', duration: 300 },
      { name: '2. Throttle Allocation', desc: 'Allocated 4 throttled worker threads with IO limit', duration: 400 },
      { name: '3. Non-Blocking Index Scan', desc: 'Scanning table blocks with dynamic latency cap', duration: 1500 },
      { name: '4. Deadlock Detection Monitor', desc: '0 write queries blocked during index build', duration: 800 },
      { name: '5. Mark Index Valid', desc: 'Index build finished safely. 0.29ms validation check.', duration: 300 },
    ]
  }
];

export default function ProductSandbox() {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState('strata'); // 'strata' | 'standard'
  const [simulating, setSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState([]);

  // Reset simulation when scenario changes
  const handleSelectScenario = (scenario) => {
    setActiveScenario(scenario);
    setSimulating(false);
    setCurrentStep(-1);
    setCompletedSteps([]);
  };

  const startSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    setCurrentStep(0);
    setCompletedSteps([]);

    let stepIdx = 0;
    const runNextStep = () => {
      if (stepIdx < activeScenario.steps.length) {
        setCurrentStep(stepIdx);
        setCompletedSteps(prev => [...prev, stepIdx]);
        const dur = activeScenario.steps[stepIdx].duration;
        stepIdx++;
        setTimeout(runNextStep, dur);
      } else {
        setSimulating(false);
      }
    };

    runNextStep();
  };

  const resetSimulation = () => {
    setSimulating(false);
    setCurrentStep(-1);
    setCompletedSteps([]);
  };

  return (
    <section id="sandbox" className="py-20 md:py-28 bg-obsidian-subtle border-t border-b border-obsidian-border relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>INTERACTIVE ENGINE DEMO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Simulate a Zero-Lock Production Migration
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Compare standard PostgreSQL <code className="text-rose-400 font-mono text-sm bg-obsidian-card px-1.5 py-0.5 rounded border border-obsidian-border">ALTER TABLE</code> execution against Strata's lock-free shadow dual-write pipeline.
          </p>
        </div>

        {/* Interactive Scenario Picker Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {SCENARIOS.map((sc) => {
            const isSelected = activeScenario.id === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc)}
                className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                  isSelected
                    ? 'bg-obsidian-card border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-obsidian-card/40 border-obsidian-border hover:border-slate-700 hover:bg-obsidian-card/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded font-semibold ${
                    isSelected ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {sc.id.toUpperCase()}
                  </span>
                  <Database className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{sc.title}</h3>
                <p className="text-xs font-mono text-slate-400">{sc.table}</p>
              </button>
            );
          })}
        </div>

        {/* Main Sandbox Visual Card */}
        <div className="rounded-2xl bg-obsidian-card border border-obsidian-border shadow-2xl overflow-hidden glass-panel">
          
          {/* Card Header & Mode Toggles */}
          <div className="p-4 bg-obsidian-panel border-b border-obsidian-border flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3 w-full md:w-auto">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{activeScenario.title}</span>
                  <span className="text-xs font-mono font-normal text-slate-400">({activeScenario.table})</span>
                </h4>
                <p className="text-xs font-mono text-slate-400">Strata Execution Invariants: ACTIVE</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <button
                onClick={startSimulation}
                disabled={simulating}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
                  simulating
                    ? 'bg-amber-500/30 text-amber-200 cursor-not-allowed border border-amber-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-obsidian shadow-md shadow-amber-500/20 active:scale-95'
                }`}
              >
                <Play className={`w-3.5 h-3.5 fill-current ${simulating ? 'animate-spin' : ''}`} />
                <span>{simulating ? 'Simulating Pipeline...' : 'Run Simulation'}</span>
              </button>

              <button
                onClick={resetSimulation}
                className="p-2 rounded-lg bg-obsidian-subtle border border-obsidian-border text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-obsidian-border">
            
            {/* Left Column: Live Step Progress & Telemetry */}
            <div className="lg:col-span-5 p-6 bg-obsidian/60 space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-obsidian-border/60">
                <span className="text-xs font-mono text-slate-400 font-semibold flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  MIGRATION PIPELINE STAGES
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {completedSteps.length} / {activeScenario.steps.length} Completed
                </span>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3">
                {activeScenario.steps.map((step, idx) => {
                  const isDone = completedSteps.includes(idx);
                  const isCurrent = currentStep === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-lg border transition-all ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          : isCurrent
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 animate-pulse'
                          : 'bg-obsidian-card/40 border-obsidian-border/60 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold flex items-center gap-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isCurrent ? (
                            <Zap className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] shrink-0">
                              {idx + 1}
                            </div>
                          )}
                          <span className={isDone ? 'text-emerald-300' : isCurrent ? 'text-amber-300' : 'text-slate-400'}>
                            {step.name}
                          </span>
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 pl-6">{step.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Real-time Metric Callout */}
              <div className="p-4 rounded-xl bg-obsidian-panel border border-obsidian-border space-y-2">
                <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>MAXIMUM TABLE LOCK DURATION</span>
                  <span className="text-emerald-400 font-bold font-mono">GUARANTEED</span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-extrabold font-mono text-amber-400">{activeScenario.strataLockMs} ms</span>
                  <span className="text-xs font-mono text-rose-400 line-through">
                    vs {(activeScenario.standardLockMs / 1000).toFixed(1)}s (Standard DDL)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">
                  Strata holds catalog lock only long enough to reassign relation OIDs atomically.
                </p>
              </div>

            </div>

            {/* Right Column: Code & Plan Comparison */}
            <div className="lg:col-span-7 p-6 bg-obsidian space-y-6 flex flex-col justify-between">
              
              {/* Tab Selector */}
              <div>
                <div className="flex items-center justify-between border-b border-obsidian-border/80 pb-3 mb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('strata')}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
                        activeTab === 'strata'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-obsidian-card text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Strata Zero-Lock Execution Plan</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('standard')}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
                        activeTab === 'standard'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-obsidian-card text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Standard PostgreSQL DDL</span>
                    </button>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
                    SYNTAX: SQL / STRATA DDL
                  </div>
                </div>

                {/* SQL Code Block */}
                <div className="relative rounded-lg bg-obsidian-card border border-obsidian-border p-4 font-mono text-xs overflow-x-auto shadow-inner min-h-[220px]">
                  {activeTab === 'strata' ? (
                    <pre className="text-amber-200/90 whitespace-pre-wrap leading-relaxed">
                      {activeScenario.strataPlanSql}
                    </pre>
                  ) : (
                    <div>
                      <pre className="text-rose-300/90 whitespace-pre-wrap leading-relaxed mb-4">
                        {activeScenario.standardSql}
                      </pre>
                      <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                        <strong className="block mb-1 font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          LOCK HAZARD WARNING:
                        </strong>
                        {activeScenario.standardEffect}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Latency Comparison Graph Bar */}
              <div className="pt-4 border-t border-obsidian-border/80">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                    SIMULATED QUERY LATENCY SPIKE UNDER TRAFFIC (50,000 QPS)
                  </span>
                </div>

                {/* Graph Representation */}
                <div className="space-y-2 font-mono text-[11px]">
                  {/* Standard DDL */}
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Standard ALTER TABLE</span>
                      <span className="text-rose-400 font-bold">{(activeScenario.standardLockMs / 1000).toFixed(1)}s lock delay (HTTP 504)</span>
                    </div>
                    <div className="w-full h-3 bg-obsidian-panel rounded-full overflow-hidden border border-obsidian-border">
                      <div className="h-full bg-gradient-to-r from-rose-500 to-red-600 w-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Strata Engine */}
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Strata Zero-Lock Plan</span>
                      <span className="text-amber-400 font-bold">{activeScenario.strataLockMs} ms catalog swap (0 HTTP drops)</span>
                    </div>
                    <div className="w-full h-3 bg-obsidian-panel rounded-full overflow-hidden border border-obsidian-border">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 w-[2%] min-w-[12px] rounded-full"></div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
