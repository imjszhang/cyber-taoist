# AI × PKM Weekly · Issue #2

Status: **outline draft** — research packs + 加量 Discover #4–#5 **PM 已过并进仓**（本机，未 push）  
Studio branch: `cursor/v1-discover-newsletter-scaffold-d887` (local only; do not push)  
Theme: *Agents in the notes loop*  
Working title: **Context that ships**

> Free weekly for AI × PKM builders. External copy in English. Do not send email until JS confirms.

---

## Intro (draft)

Issue #1 was about *accumulation*: a wiki that compounds, notes Future You can find, local neighbors that surface without perfect backlinks.

Issue #2 is about *motion*. Notes stop being a museum and start feeding agents and drafts—without turning the vault into a pastebin or letting the model do your thinking.

Two Discover pieces this round (plus a probe). Local-model PKM is queued behind them as Discover #6.

---

## Shell

| Section | What |
|---------|------|
| Judgment | Notes as agent memory vs chat pastebins |
| Discover ×2 | Codex × vault (`AGENTS.md`) · Notes → draft (where AI stops) |
| Probe | ≤30 min shipping experiment |
| Next | Local-model PKM (#6) + Issue #3 tease |

---

## 1. Judgment

**Angle:** Durable notes beat pasted context. The scarce skill is giving agents a *schema* (what they may touch) and writers a *stop line* (what the model may not author for you).

**Reader takeaway:** Treat the vault like a repo with a constitution—and treat evergreen promotion like a human gate, not an autocomplete.

---

## 2. Discover briefs（PM 已过 · 本机已进仓）

### 2.1 Vault is a folder: Codex + `AGENTS.md` as the schema for note ops

- **Slot:** Discover 加量 #4（PM 已过 · 本机已进仓）
- **Research pack:** `cyber-taoist-team/research/来源包/2026-10-17-codex-notes.md`（PM 已过）
- **PM cut:** `AGENTS.md` / vault = folder
- **Newsletter blurb (provisional):** Your Obsidian vault is just a directory. Point a coding agent at it with a root `AGENTS.md` (what to read, what never to touch—`.obsidian`, raw sources) and review every session with Git. Plugin chat is optional; filesystem + schema is the connection.
- **Primary sources (for English):** OpenAI AGENTS.md docs + Aishwarya Srinivasan Obsidian+Codex setup; optional CLAUDE.md / Dexio guardrails as cross-tool.
- **Why it fits:** Moves Issue #1’s “compile a wiki” into an operable agent loop on the same vault.
- **Path:** `content/discover/codex-notes-vault.md` → `/discover/codex-notes-vault`

### 2.2 From evergreen notes to a draft: where AI should stop

- **Slot:** Discover 加量 #5（PM 已过 · 本机已进仓）
- **Research pack:** `cyber-taoist-team/research/来源包/2026-10-17-writing-workflow.md`（PM 已过）
- **PM cut:** notes → draft；AI 停哪一层
- **Newsletter blurb (provisional):** Blank-page writing is expensive if you already have evergreen notes. Matuschak’s executable strategy is outline → hang notes → concatenate → rewrite. Use AI for capture, literature, and critique loops—not to ghostwrite the evergreen layer or the final voice.
- **Primary sources (for English):** Andy Matuschak executable strategy (+ Writing Slowly case); Zettelkasten forum on AI-as-editor; Shadow evergreen funnel as “stop line” example (label commercial).
- **Why it fits:** Closes the loop from agent-readable vault to human-authored shipping.
- **Path:** `content/discover/writing-notes-to-draft.md` → `/discover/writing-notes-to-draft`

**This issue (not yet writing):** Local-model PKM pack **PM 已过**, queued as Discover #6 — privacy / Ollama stack; preview only below.

**Out this issue:** model-release news; generic ChatGPT writing tips; philosophy axiom rewrite.

---

## 3. This week’s probe

1. Add or tighten one vault-root `AGENTS.md` (or `CLAUDE.md` that `@AGENTS.md`): three rules max—e.g. never edit `.obsidian`, treat `raw/` as read-only, prefer search-before-create.  
2. Run one agent session that updates **one** note or brief. Review with `git diff`.  
3. Separately: pick three evergreen notes → one outline → concatenate a messy first draft **yourself**; ask an AI only for a critique pass (accept/reject each suggestion).

Goal: practice schema + stop line, not prompt tourism. Time box: 30 minutes.

---

## 4. Queued / next

- **Discover #6 (queued):** Local-model PKM — `research/来源包/2026-10-17-local-model-pkm.md` (PM 已过; English not this round). Angle: chat with notes when nothing leaves the machine.
- **Issue #3 tease (soft):** after #4–#6 land—shipping cadence, or deepen local vs cloud tradeoffs.

**Link back:** Issue #1 stack (LLM Wiki · Progressive Summarization · Smart Connections) as prerequisite reading.

---

## Subscribe / landing (site stub)

- Same promise as #1: weekly methods worth trying—judgment, reusable workflows, one probe.  
- Free; no paywall in V1.  
- Landing: `site/src/newsletter.html` (no live ESP yet). After local preview: `/discover/<slug>` links.

---

## Open blockers

- [x] Research packs #4–#6 PM 已过
- [x] Issue #2 theme + two slots locked (Codex×笔记 · 写作工作流)
- [x] English: +2 Discover drafts PM 已过 → Studio `content/discover/`
- [x] Blurbs/paths updated to in-repo files
- [ ] Local-model PKM (#6) English when PM schedules
- [ ] Optional: full English email body after landing links exist
