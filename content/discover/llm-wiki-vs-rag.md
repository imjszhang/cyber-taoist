---
title: "Stop Re-Finding Everything: Build a Wiki Your LLM Keeps Current"
date: 2026-10-17
summary: "Andrej Karpathy’s LLM Wiki pattern treats your notes like a codebase—raw sources stay immutable, the model maintains a compounding Markdown wiki, and you ask better questions. Here is when that beats classic RAG, how it sits next to Progressive Summarization, and what to watch for."
tags: ai-pkm, ai-second-brain, tools-for-thought
type: method
source: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
sourceLabel: Andrej Karpathy — LLM Wiki (gist)
status: unreviewed
---

Most “AI second brain” demos still work like a search box with better manners: you ask, the model digs through chunks, answers, and forgets. The next question starts from zero.

Andrej Karpathy’s **LLM Wiki** idea flips that default. Instead of only retrieving at query time, you have the model **compile and maintain** a persistent Markdown wiki between you and your raw sources. Knowledge compounds. Cross-links already exist. Contradictions get flagged once, then stay visible.

This Discover piece explains the pattern, when it helps, how it contrasts with Tiago Forte’s Progressive Summarization, and where a local tool like Smart Connections fits—without pretending any of this replaces your judgment.

> **Verification status:** Not tested by Cyber-Taoist editorial. Claims below follow the cited sources. Treat this as an explainer of methods worth trying, not a lab report.

---

## The problem: RAG rediscovers; it does not accumulate

**Author view (Karpathy):** Typical LLM-and-document setups look like RAG. You upload files; at query time the model retrieves relevant chunks and answers. That works, but the model rediscovers knowledge from scratch every time. There is no accumulation. Subtle questions that need five documents force the same piecing-together again. NotebookLM-style uploads and most RAG stacks behave this way.

**Editorial analysis:** This matches a common second-brain failure mode: capture scales, synthesis does not. Vaults grow; insight stays chat-ephemeral. If your “AI PKM” only answers and never writes durable structure, you are renting retrieval, not building a repository Future You can browse.

---

## The pattern: three layers, three operations

**Author view (Karpathy):** The architecture has three layers:

1. **Raw sources** — curated originals (articles, papers, notes). Immutable. The LLM reads them; it never rewrites them. Source of truth.
2. **The wiki** — LLM-generated Markdown: summaries, entity pages, concepts, comparisons, synthesis. The model creates and updates pages, maintains cross-references, keeps claims consistent. You read; the LLM writes.
3. **The schema** — a discipline file (`CLAUDE.md`, `AGENTS.md`, or similar) that tells the agent how the wiki is structured, what conventions to follow for ingest/query/lint, and how not to behave like a generic chatbot. You and the model co-evolve this over time.

Three operations keep it alive:

| Operation | What happens |
|-----------|----------------|
| **Ingest** | Drop a source into raw; ask the agent to process it. It may discuss takeaways, write a summary page, update the index, touch related entity/concept pages, append a log entry. One source can update many wiki pages. |
| **Query** | Ask against the wiki. The agent finds pages, synthesizes with citations. Strong answers can be **filed back** as new wiki pages so exploration compounds. |
| **Lint** | Periodically ask for a health check: contradictions, stale claims, orphans, missing concept pages, weak cross-links, gaps worth a web search. |

Two navigation aids: **`index.md`** (content catalog by category) and **`log.md`** (append-only chronology of ingests, queries, lint passes). At moderate scale, the index often replaces embedding RAG for “what page should I open?”

**Metaphor (Karpathy):** Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase. In practice: agent on one side, Obsidian graph on the other—edits land as Markdown you can follow in real time.

**Editorial analysis:** The unlock is economic, not mystical. Humans abandon personal wikis because maintenance grows faster than value. LLMs do not get bored updating fifteen files in one pass. Your scarce work shifts to sourcing, directing analysis, and deciding what the synthesis *means*.

---

## How to try it this week (minimal path)

No product required—any coding agent plus a Markdown vault is enough.

1. **Pick one domain** (one research thread, one book, one work area). Do not start with “my whole life.”
2. **Create three folders/files:** `raw/` (immutable sources), `wiki/` (agent-owned), and a schema file that states conventions in plain language.
3. **Ingest one source with supervision.** Stay in the loop for the first few: read the summary, check what else the agent touched, correct emphasis in the schema if needed.
4. **Ask one synthesis question** that would normally need several docs. If the answer is good, tell the agent to file it as a wiki page with citations.
5. **Run one lint pass** after ~5–10 sources. Fix orphans and contradictions before scaling volume.

**Editorial analysis:** Batch ingest is possible; Karpathy notes he prefers one-at-a-time involvement early. That matches PKM reality: the first schema decisions (what is an “entity,” when to create a concept page) shape everything downstream.

---

## Contrast: Progressive Summarization still matters

**Author view (Forte):** A second brain’s hard problem is not capture—it is forwarding knowledge **through time** to the future moment when it is usable. Progressive Summarization balances **discoverability** (compression) and **understanding** (context) in layered notes: Layer 0 source → Layer 1 captures → Layer 2 bold → Layer 3 highlight → Layer 4 your own summary → rare remix. Work is opportunistic: you deepen layers when you already revisit a note for a live project. PARA organizes by actionability; note design makes packets sellable to Future You.

**Editorial analysis:** LLM Wiki and Progressive Summarization answer different bottlenecks.

| | LLM Wiki (Karpathy) | Progressive Summarization (Forte) |
|--|---------------------|-----------------------------------|
| Who writes the structure? | Mostly the LLM | Mostly you |
| What compounds? | Cross-linked wiki pages + filed answers | Layered, discoverable notes |
| Risk if automated badly | Confident wrong synthesis | Over-capture / note graveyard |
| Best suited for | Multi-source research that needs ongoing consistency | Personal judgment, voice, and creative remixed output |

AI can accelerate Distill; Express and judgment remain human—whether you bold a passage yourself or reject a wiki revision. Use **LLM Wiki** when the pain is maintenance and synthesis across many sources. Use **Progressive Summarization** when the pain is “I saved it, Future Me can’t find why it mattered.” Many strong setups will do both: agent-maintained wiki for the research graph; human layers for the notes that must carry *your* voice.

---

## Tool layer: local semantic connections (optional)

**Author view (Smart Connections / Brian Petro):** While you work in a note, local embeddings surface semantically related notes and passages—even without shared keywords or existing links. Core needs no API key by default; cloud only if you configure it. Complements exact search and backlinks; you still choose what to open, reuse, or ignore.

**Editorial analysis:** This is a **discovery** surface, not a full wiki-compiler agent. It helps when the vault already has human-written density and you need “ideas like this one.” It does not replace ingest/query/lint discipline. Privacy-minded readers can pair local Connections for retrieval with an LLM Wiki workflow that keeps raw sources local and schemas explicit about what leaves the machine.

---

## Fit, limits, and failure modes

**Worth trying if you:**

- Are building knowledge over weeks (research, competitive maps, long reading)
- Already live in Markdown / Obsidian-style tools
- Can review agent edits (you will—at least early)

**Limits called out by sources / editorial:**

- Karpathy’s gist is an **idea file**, not a product. You instantiate it with your agent and domain.
- Wiki text is LLM-authored: hallucinations, soft contradictions, and tone drift need human lint.
- There is real tension with “writing is thinking.” If the model writes every page, you may outsource the cognition that Progressive Summarization was designed to protect. Keep Express and high-stakes judgments in your own words.
- Smart Connections is not a substitute for schema, ingest discipline, or citation hygiene.
- This package was **not** editorially tested end-to-end.

---

## Bottom line

An AI-powered second brain is less about a smarter search box and more about **who maintains the middle layer**. Karpathy’s LLM Wiki pattern puts the model on bookkeeping and cross-links so you can spend attention on sources and questions. Forte’s Progressive Summarization reminds you that discoverability for Future You still needs deliberate compression—and that judgment is not a plugin.

Start small: one domain, one schema, one supervised ingest, one filed answer. Let the wiki compound only as fast as you can still read it.

---

## Sources

1. Andrej Karpathy — [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) (gist / idea file for coding agents)
2. Tiago Forte — [Progressive Summarization](https://fortelabs.com/blog/progressive-summarization-a-practical-technique-for-designing-discoverable-notes/) · Forte Labs; see also [Building a Second Brain](https://www.buildingasecondbrain.com/)
3. Brian Petro — [Smart Connections](https://smartconnections.app/smart-connections/) (Obsidian plugin; local embeddings by default)
