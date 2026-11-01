---
title: "Your Vault Is a Folder: Point a Coding Agent at Your Notes"
date: 2026-10-17
summary: "Obsidian vaults are directories. Coding agents like Codex already work on directories. Pair them with an AGENTS.md schema—deny rules, Git review, and human gates—and you get repo-as-notes without a proprietary plugin. Here is the pattern, when it helps, and what to keep off the agent’s write path."
tags: ai-pkm, ai-second-brain, tools-for-thought
type: workflow
source: https://aishwaryasrinivasan.substack.com/p/how-to-set-up-your-second-brain-with
sourceLabel: Aishwarya Srinivasan — Second brain with Obsidian + Codex
verification: none
status: unreviewed
---

Most “AI for notes” products sell a plugin: install, connect an API key, chat inside the vault. That works—until you want the same agent that already refactors your codebase to treat your notes as a first-class project.

A simpler frame is spreading: **the vault is a folder**. A coding agent (Codex, Claude Code, and peers) is a filesystem worker. “Connecting” is `cd` into the vault and running the agent—not wiring a proprietary bridge. The discipline file (`AGENTS.md` / `CLAUDE.md`) is the schema that keeps the agent useful instead of chaotic.

This Discover piece explains that repo-as-notes pattern, how official agent docs make a root instruction file work, where to put guardrails, and how it differs from an LLM Wiki that *compiles* pages (Discover #1) or a local semantic finder (Discover #3).

> **Verification status:** Not tested by Cyber-Taoist editorial. Claims follow the cited practitioner write-up and official agent docs. Treat this as an explainer of a method worth trying, not a lab report.

---

## The insight: connection = folder + agent

**Practitioner view (Aishwarya Srinivasan):** An Obsidian vault is ordinary files on disk. Codex (or a similar coding agent) already reads and writes directories. The setup is: install Obsidian, keep a light folder layout (`notes/`, `daily/`, `projects/`, `references/`), drop an `AGENTS.md` at the vault root, then run the agent from that directory. Typical jobs include summarizing across notes, spotting contradictions, and turning a week of meeting notes into a project brief—without asking the agent to rewrite `.obsidian` config.

**Editorial analysis:** This reframes “AI second brain” from *chat widget inside the note app* to *agent with a project brief for your knowledge repo*. It fits people who already trust Git, diffs, and coding agents. It is a poor default if you only want a one-click summarize button and never open a terminal.

---

## Why `AGENTS.md` is the schema

**Author / product view (OpenAI Codex docs):** Codex reads `AGENTS.md` before acting. Discovery is layered: a global home config plus project files from the repo root down to the working directory. Same-directory overrides win; deeper files override shallower ones; merged instruction size is capped (default on the order of tens of kilobytes). You can point fallback filenames at existing team guides so the vault does not need a second parallel bible.

**Author / product view (Anthropic Claude Code docs):** `CLAUDE.md` is human-written persistent instruction; the tool can also honor `AGENTS.md`. Prefer short, checkable rules (paths, naming, commands)—on the order of under ~200 lines—and push long procedures into skills or path-scoped rules. Local preferences can live in a gitignored local file; shared repo rules stay in the committed instruction files.

**Editorial analysis:** For a single vault serving more than one agent, put shared rules in `AGENTS.md` and let Claude-side files import or mirror them. The file is not magic—it is a **contract**: what the agent may touch, how notes are named, and what “done” looks like for a session.

---

## A practical vault layout and deny list

**Practitioner view (Dexio guide, Claude Code + Obsidian):** Start in the vault with the agent CLI. A workable layout separates `inbox/`, `raw/` (immutable sources), `notes/`, plus navigation aids like `index.md` and a session `log.md`. A vault instruction template typically asks for wikilinks, search-before-create, and a hard ban on editing `.obsidian`. When Codex and Claude Code share one vault: keep shared policy in `AGENTS.md`, import it from `CLAUDE.md`, deny edits to raw sources and Obsidian config in agent settings, and review every session with `git diff`.

**Editorial analysis:** Deny paths and Git review are the difference between “helpful intern” and “silent vandal.” Raw captures and app config should be read-only to the agent. Treat plans as plans—not as evidence that work finished (a principle OpenAI’s Codex workflow cookbook stresses for software harnesses; it transfers cleanly to note ops).

---

## Try path (minimal)

1. Put the vault under Git (even if you never push).
2. Add a root `AGENTS.md`: folder meanings, naming, “never edit `.obsidian` or `raw/`,” prefer edit-over-create, end with a short session log entry.
3. From the vault root, start Codex (or Claude Code) and ask for a **read-only** pass: contradictions on one topic, or a brief from last week’s meeting notes.
4. Inspect `git diff`; keep, revise, or revert before a write-heavy follow-up.
5. Only then allow targeted edits inside `notes/`—still never bulk-rewrite history.

**Editorial analysis:** First sessions should prove *judgment*, not throughput. If the diff feels wrong, tighten the schema before unlocking writes.

---

## How this sits next to LLM Wiki and plugins

| Job | Lean toward |
|-----|-------------|
| Agent reads/writes the live vault with human-gated diffs | Codex / Claude Code + `AGENTS.md` (this piece) |
| Model maintains a compounding compiled wiki between you and raw sources | LLM Wiki pattern (Discover #1) |
| “Notes like this one” while you draft, often local | Smart Connections (Discover #3) |
| Human Distill layers that make notes findable | Progressive Summarization (Discover #2) |

**Editorial analysis:** Repo-as-notes is an **operations surface**. LLM Wiki is a **compile surface**. You can use both: raw + notes under Git for the agent; a separate wiki tree the model maintains. Do not confuse “the agent edited three files” with “the wiki is consistent.”

---

## Limits and failure modes

- Cloud coding agents send vault context to the model provider—unlike local-only embedding discovery. If that is unacceptable, use a local model stack (queued Discover) or keep secrets out of the vault.
- Official docs describe general repos; vault-specific rules (wikilinks, `.obsidian`, evergreen titles) are yours to write.
- Paid practitioner essays may truncate steps behind a paywall; verify against official `AGENTS.md` / `CLAUDE.md` pages.
- Without Git + deny rules, an eager agent will “helpfully” reorganize your life.
- This article did not run Codex against a real vault (`verification: none`).

---

## Bottom line

You do not need a proprietary “brain plugin” to get an agent into your notes. **Treat the vault as a folder, the agent as a filesystem worker, and `AGENTS.md` as the schema.** Keep raw and app config off the write path, review every diff, and reserve compiled-wiki dreams for a deliberate LLM Wiki layer. That is how coding-agent habits transfer to knowledge work without pretending the model owns your judgment.

---

## Sources

1. [How to Set Up Your Second Brain with Obsidian and Codex](https://aishwaryasrinivasan.substack.com/p/how-to-set-up-your-second-brain-with) — Aishwarya Srinivasan (2026-07-17)
2. [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) — OpenAI / ChatGPT Learn
3. [CLAUDE.md / memory](https://code.claude.com/docs/en/claude-md) — Anthropic Claude Code Docs
4. [Obsidian + Claude Code guide](https://dexio.wiki/guides/obsidian-claude-code/) — Dexio (updated 2026-10-01); commercial product at end of page
5. [Iterating development workflows with Codex](https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex) — OpenAI Cookbook (harness / human-gate principles)
