# 架构变更日志

记录知识库**架构**（目录结构、方法论、工作流程）的变更。日常内容写入不记录在此。

版本规则见 [README — 版本管理](README.md#版本管理)。

## V1.2.1 — 2026-04-08

命名规范统一：确立 **Cyber-Taoism**（名词，指思想体系本身）与 **Cyber-Taoist**（形容词/实践者）的区分用法。

### 变更

- 全部散文中的小写 `cyber-taoist` 统一为 `Cyber-Taoist`（形容词）或 `Cyber-Taoism`（名词）
- 站点 meta title / description / OG 标签改用 `Cyber-Taoism` 指代框架本身
- keywords 新增 `cyber-taoism` 提升 SEO 覆盖
- 技术标识符（npm 包名、域名、localStorage 键、GitHub URL）保持小写 `cyber-taoist` 不变
- archive/ 历史版本保持原样

### 涉及文件

- 核心理论：`CONSTITUTION.md`（→ v1.0.1）、`DAO-DE-JING-CYBERTAOIST.md`（→ v1.0.3）、`README.md`
- 站点源码：`site/src/index.html`、i18n 语言包、`llms.txt`、`SKILL.md`
- 构建输出：`docs/` 同步更新
- Corpus / Pyramid / Journal / clawhub-skill / scripts — 批量大写化

## V1.2.0 — 2026-03-20

原始素材层扩展，与 **js-knowledge-prism** 工具的 **corpus** 管线对齐。

### 架构

- 新增 [`corpus/`](corpus/)：按系列子目录存放外部长文；可选每系列 `_series.md` 作为系列上下文
- 约定文章文件名以四位序号开头（如 `0010-chapter.md`），便于 atom 编号 `XX-0010-01` 形式与排序
- 拆解产出的 atoms 落在 `pyramid/analysis/atoms/corpus-<系列名>/`，与按月目录 `YYYY-MM/` 并存
- 提供 [`corpus/_template/_series.md`](corpus/_template/_series.md) 作为系列说明模板

### 工作流

- 长文 / 连载 → 放入 `corpus/<系列>/` → `prism process`（可用 `--series` 仅处理指定系列）
- 短笔记 / 日记 → 仍使用 `journal/YYYY-MM-DD/`
- `scripts/flomo-import` 仍以 journal 为主；corpus 适合非 flomo 形态的外部正文

## V1.1.0 — 2026-03-11

产出层架构优化，引入组件化、类型抽象、多粒度、多阶段、多源绑定。

### 架构

- 新增 `outputs/components/` — 可复用 Prompt 组件（persona、style、constraints、review），通过 `{{@include path}}` 引用
- 新增 `outputs/types/` — 产出类型定义层（diary、blog），声明读者画像、拆分粒度、变量契约、质量标准
- Prompt 模板支持五个区段：System Prompt、Unit Prompt、Skeleton Template、Review Prompt、Stage sections
- 产出不再局限于"一个视角对应一个产出"，支持多视角交叉和直接从 analysis 层生成

### 素材拆分

- `per-kl`（默认）：每个 Key Line 一篇产出
- `per-perspective`：整个视角聚合为一篇产出
- `per-group`：每个 Group 一篇产出

### 质量校验

- 模板可定义 `# Review Prompt` 区段，配合 `--review` 使用
- 审校报告输出到 `_reviews/` 子目录

### 多阶段流水线

- 模板可声明 `stages` 和 `# Stage: <name>` 区段，支持 outline → draft → polish 等多阶段生成
- 中间产物存放在 `_staging/` 子目录，支持 `--stage` 恢复

### 多源绑定

- `--perspective P01,P02` 支持多视角交叉产出
- `--source analysis --groups G01,G02` 直接从 analysis 层生成

### 工作流

- 新建产出流程更新：选择类型 → 创建模板 → 骨架 → 审查 → 生成 → 可选审校
- CLI 新增 `--list-types`、`--review`、`--stage`、`--source`、`--groups` 选项

## V1.0.0 — {{date}}

初始架构，由 js-knowledge-prism 工具生成。

### 架构

- 三层目录结构：`journal/`（原始素材）→ `pyramid/`（结构化拆解）→ `outputs/`（面向读者的产出）
- journal 按日期组织（`YYYY-MM-DD/`），每日可含多篇笔记
- outputs 与 pyramid 视角一一对应，视角的 tree 结构决定产出的章节组织

### 方法论

- 金字塔拆解分两阶段：自下而上（analysis：atoms → groups → synthesis）、自上而下（structure：SCQA → tree → validation）
- analysis 阶段所有视角共享，structure 阶段按视角独立
- atoms 按月分子目录（`YYYY-MM/`），支持增量拆解

### 工作流

- 增量拆解流程：新 journal → 提取 atoms → 审视 groups → 检查 synthesis → 检查各视角 → 追加修订记录
- 新建视角流程：通过 `_template/` 模板创建
- 新建产出流程：确认视角完成 → 创建产出目录 → 按 tree 结构组织内容
