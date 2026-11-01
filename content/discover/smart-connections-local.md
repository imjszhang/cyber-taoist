---
title: "When Related Notes Find You: Local Semantic Connections in Obsidian"
date: 2026-10-17
summary: "Keyword search needs the words you remember. Backlinks need links you already made. Smart Connections starts from the note in front of you and surfaces meaning-neighbors—usually with local embeddings and no API key. Here is when that discovery layer fits an AI second brain."
tags: ai-pkm, tools-for-thought, ai-second-brain
type: workflow
source: https://smartconnections.app/smart-connections/
sourceLabel: Brian Petro — Smart Connections
status: unreviewed
---

A growing vault outruns your working memory. You reopen debates without their constraints. You re-research what you already wrote. Exact search fails when you forgot the filename; backlinks fail when you never linked the idea.

**Smart Connections** (Brian Petro) attacks a narrower problem than “chat with my vault.” It asks: while this note is open, which other notes or passages are *about the same meaning*—even without shared keywords or existing links?

This Discover piece covers the product’s local-first discovery model, how it differs from keyword search and backlinks, when to pair it with a cloud writing agent (e.g. Obsidian Copilot), and how it completes the “AI second brain” triangle with an LLM-maintained wiki and Progressive Summarization.

> **Verification status:** Not tested by Cyber-Taoist editorial. Capabilities below follow the cited product pages and a practitioner write-up. Plugin UIs change; check current docs before installing.

---

## What the tool claims to do

**Author / product view (Smart Connections):**

- Start from **the note in view** (or a passage), not from a blank search box.
- Surface related notes and passages via **semantic similarity**, including ideas you did not think to search or link.
- **Core** runs with **local embeddings by default**—no API key required for the standard related-note workflow.
- Cloud providers receive text only if **you** configure them.
- Complements two other clues:
  - **Exact search** — words, paths, tags, regex you remember
  - **Backlinks** — relationships already written into notes
  - **Connections** — meaning-neighbors without matching wording

Open a result to inspect the matching passage without leaving the work note. Core includes Connections view and footer-style surfaces; Pro adds finer placement (e.g. inline suggestions) and ranking controls—edition boundaries evolve, so treat marketing pages as the source of truth.

**Editorial analysis:** This is a **discovery** surface, not a wiki compiler and not a full writing agent. It shines when the vault already has density and you need “notes like this one” while drafting. It will not invent Progressive Summarization layers or maintain cross-wiki consistency for you.

---

## How local embeddings change the feel

**Practitioner view (Effortless Academic):** After install, the plugin indexes the vault locally—described as offline-capable and not uploading notes for the core similarity workflow. Related notes get similarity scores; semantic lookup can find papers or snippets that share *idea space* without shared keywords. Compared with Copilot: Smart Connections is positioned as free/offline/fast for related-note discovery; Copilot as stronger for editing, custom prompts, and vault Q&A that typically need an API key and send context to a model provider.

**Editorial analysis:** “Local by default” is the product promise for Core retrieval—not a blanket claim that every Obsidian AI plugin is private. Installation, model downloads, and optional cloud chat still touch the network. If privacy is the reason you chose Connections, keep cloud embedding/chat off and verify settings after updates.

---

## Fit next to Copilot-style agents

| Job | Lean toward |
|-----|-------------|
| “What else in my vault is like this note?” | Smart Connections |
| “Rewrite / summarize / chat with selected text” | Copilot-style agent (API) |
| “Answer a question across many notes with citations” | Vault QA agents (often cloud) |
| “Compile a persistent research wiki” | LLM Wiki pattern (Discover #1) |
| “Make this note sellable to Future Me” | Progressive Summarization (Discover #2) |

**Editorial analysis:** You can run discovery locally and still use a cloud agent for Express—just be explicit about what leaves the machine. Do not treat Connections as a substitute for Distill judgment or for a maintained wiki.

Obsidian Copilot’s own positioning (knowledge-work agent, semantic find, multi-model chat) is a different product class. Use it as contrast in this article, not as the hero.

---

## A short try path

1. Install **Smart Connections** from Obsidian community plugins; wait for local index to finish.
2. Open a note with real substance (not a stub title).
3. Open the Connections view; expand one mid-score result you would not have searched for.
4. Bring one useful passage into the draft; leave the rest.
5. Optional contrast: run the same question in a vault-QA plugin with an API key—and notice latency, cost, and what gets sent.

**Editorial analysis:** Score ≠ truth. High similarity can mean shared boilerplate (“methodology,” “meeting notes”). You still decide what to open, link, or ignore—the product says as much.

---

## Limits and failure modes

- Discovery ≠ agent: it will not reliably rewrite, plan, or lint a knowledge graph.
- Core vs Pro feature splits change; do not hard-code old UI claims in workflows.
- Sparse vaults give sparse neighbors—Connections amplifies existing writing density.
- Practitioner blogs are secondary sources; prefer official docs for install and privacy claims.
- This article did not re-benchmark models or offline behavior (`verification: none`).

---

## Bottom line

An AI second brain needs more than chat. **Smart Connections** covers the find layer: related notes arrive while you work, often without an API key. Pair it with human Distill (#2) and, when research must compound, an LLM-maintained wiki (#1). Keep the triangle clear—compile, distill, discover—so no single plugin pretends to be the whole brain.

---

## Sources

1. [Smart Connections](https://smartconnections.app/smart-connections/) — Brian Petro
2. [obsidian-smart-connections](https://github.com/brianpetro/obsidian-smart-connections/) — GitHub
3. [Adding AI to your Obsidian Notes with SmartConnections and CoPilot](https://effortlessacademic.com/adding-ai-to-your-obsidian-notes-with-smartconnections-and-copilot/) — The Effortless Academic (2025-12-17); practitioner contrast
4. [Obsidian Copilot](https://www.obsidiancopilot.com/en) — contrast tool only
