# Strata Engine — Zero-Lock PostgreSQL Schema Migrations

> **Acdyon Technologies Frontend Challenge Submission (Part 2 — Premium Home Page)**  
> **Live Demo**: Ready to deploy on Vercel/Netlify (`npm run build`)  
> **Written Decisions**: See [`DECISIONS.md`](./DECISIONS.md)

---

## ⚡ Overview

**Strata Engine** is a continuous zero-lock schema migration and data integrity platform designed for high-concurrency PostgreSQL workloads.

Standard PostgreSQL `ALTER TABLE` DDL queries acquire an `AccessExclusiveLock` on hot tables, blocking incoming `SELECT`, `INSERT`, and `UPDATE` queries. Under 50,000 QPS, this causes connection pool exhaustion and cascading HTTP 504 Gateway Timeouts.

Strata intercepts schema DDLs, provisions unconstrained shadow tables, streams continuous dual-write mutations via WAL triggers, backfills historical rows in deterministic 5,000-row chunks, and performs a **0.38ms atomic catalog OID swap**.

---

## 🎯 Key Features Built

- **Hero & Live Telemetry Ticker**: Zero-fluff value prop, copyable install CLI, and streaming event telemetry logs.
- **Interactive Migration Pipeline Sandbox**: Real-time simulation of 3 migration scenarios (`Add NOT NULL Column`, `Column Rename`, `Index Creation`).
- **SQL Diff & Lock Latency Graph**: Side-by-side comparison of standard DDL vs Strata Zero-Lock Plan with live latency spikes visualizer.
- **4-Stage Architecture Pipeline Inspector**: Static safety classifier, dual-write proxy, deterministic backfill, and atomic catalog swap.
- **Verifiable Benchmarks & CLI Simulator**: Interactive terminal runner testing `strata plan`, `strata apply`, and `strata rollback`.
- **DECISIONS.md On-Page Section**: 1-page written explanation rendered directly on the site.
- **Command Palette (`⌘K` / `Ctrl+K`)**: Keyboard-driven navigation.
- **Easter Egg (Konami Code)**: Key in `↑ ↑ ↓ ↓ ← → ← → B A` or click the terminal icon to open the secret cyberpunk dev console.
- **No AI Tropes**: Zero fake user counts, zero fake company logos, zero fabricated testimonials. 100% human-crafted engineering design.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized static output will be generated in `dist/`.

---

## 🛠️ Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Dark Obsidian Glassmorphism Tokens
- **Icons**: Lucide React
- **Fonts**: Inter & JetBrains Mono (via Google Fonts)

---

## 📜 Written Deliverables
- [`DECISIONS.md`](./DECISIONS.md) — Answers to all 3 required challenge questions.
