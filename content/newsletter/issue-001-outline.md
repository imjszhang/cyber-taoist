# AI × PKM Weekly · Issue #1

Status: **preview outline** — Discover #1–#3 **PM 已过**（本机 `content/discover/`，status=unreviewed，未 push）  
Studio branch: `cursor/v1-discover-newsletter-scaffold-d887` (local only; do not push)  
Theme: *How do you build an AI-powered second brain?*  
Working title: **Compile once, then ask better questions**

> Free weekly for AI × PKM builders. Not a philosophy serial. External copy in English. Do not send email until JS confirms.

---

## Intro (draft)

Most “AI second brain” demos still work like a polite search box: you ask, the model digs, answers, and forgets. Next question starts from zero.

This issue is about **accumulation**—a wiki the model keeps current, notes Future You can actually find, and local connections that surface meaning-neighbors without waiting for perfect backlinks. Three Discover pieces. One small probe. No vendor lock-in.

---

## Shell

| Section | What |
|---------|------|
| Judgment | Why chat-with-notes stalls without a compounding layer |
| Discover ×3 | LLM Wiki · Progressive Summarization · Smart Connections |
| Probe | ≤30 min experiment |
| Next | Issue #2 preview |

---

## 1. Judgment

**Angle:** Retrieval without accumulation is renting insight. The scarce skill is building a layer that compounds—so questions get sharper over time.

**Reader takeaway:** Treat your vault like a codebase you maintain, not a chat log you scroll.

---

## 2. Discover briefs（PM 已过 · 本机已进仓）

### 2.1 Stop Re-Finding Everything: Build a Wiki Your LLM Keeps Current

- **Path:** `content/discover/llm-wiki-vs-rag.md`
- **Newsletter blurb:** Andrej Karpathy’s LLM Wiki pattern treats your notes like a codebase—raw sources stay immutable, the model maintains a compounding Markdown wiki, and you ask better questions.
- **Why it fits:** Direct answer to “AI second brain that compounds.”

### 2.2 Progressive Summarization in the Age of AI Summaries

- **Path:** `content/discover/progressive-summarization-ai.md`
- **Newsletter blurb:** One-click AI summaries are cheap. Discoverable notes for Future You are not. Forte’s Progressive Summarization still designs for discoverability—use AI in Distill, keep judgment in Express.
- **Why it fits:** Human-side counterpart to a machine-maintained wiki.

### 2.3 When Related Notes Find You: Local Semantic Connections in Obsidian

- **Path:** `content/discover/smart-connections-local.md`
- **Newsletter blurb:** Keyword search needs words you remember; backlinks need links you already made. Smart Connections surfaces meaning-neighbors—usually local embeddings, no API key.
- **Why it fits:** Discovery layer that completes the stack without forcing a cloud chat over the whole vault.

**Out this issue:** model-release news; high-heat non-PKM topics.

After site local preview: use `/discover/<slug>` links on Newsletter landing.

---

## 3. This week’s probe

1. Pick one raw source you already trust. Leave it immutable.  
2. Ask your coding agent to write or update **one** wiki/summary page from it.  
3. List **three** claims you disagree with or want cited.  

Goal: practice judgment, not prompt tourism. Time box: 30 minutes.

---

## 4. Next issue preview (Issue #2)

Working theme: **Agents in the notes loop** — see `issue-002-outline.md` (Codex × `AGENTS.md` + notes→draft stop line; local-model PKM queued #6).

---

## Subscribe / landing (site stub)

- Promise: weekly methods worth trying—judgment, reusable workflows, one probe.  
- Free; no paywall in V1.  
- Landing: `site/src/newsletter.html` (no live ESP yet).

---

## Open blockers

- [x] PM review of Discover #1–#3 → Studio `content/discover/`
- [x] Blurbs + paths updated to in-repo files
- [ ] Site eng: list/detail + Newsletter landing walkthrough on local branch
- [x] Issue #2 packs → promote to `issue-002-outline.md` (draft; Discover paths TBD)
- [ ] Optional: full English email body after landing links exist
