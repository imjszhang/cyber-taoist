# 架构变更日志

记录知识库**架构**（目录结构、方法论、工作流程）的变更。日常内容写入不记录在此。

版本规则见 [README — 版本管理](README.md#版本管理)。

## V1.3.0 — 2026-06-06

移除 Knowledge Prism 知识管线，项目聚焦为静态理论站点 + 开发笔记。

### 变更

- 移除 `package.json` 中 `search`、`review`、`atoms` 脚本（原指向不存在的 `scripts/flomo-import/`）
- 移除 `.gitignore` 中 `outputs/` 条目
- README 删除 Knowledge Prism 三层管线描述，改为当前实际目录结构
- `journal/JOURNAL_TEMPLATE.md` 删除 `corpus/` 相关指引

### 不再维护

- `corpus/`、`pyramid/`、`outputs/` 目录及对应工作流
- `js-knowledge-prism` 工具集成
- flomo 导入与 atoms 拆解流程

## V1.2.1 — 2026-04-08

命名规范统一：确立 **Cyber-Taoism**（名词，指思想体系本身）与 **Cyber-Taoist**（形容词 / 实践者）的区分用法。

### 变更

- 全部散文中的小写 `cyber-taoist` 统一为 `Cyber-Taoist`（形容词）或 `Cyber-Taoism`（名词）
- 站点 meta title / description / OG 标签改用 `Cyber-Taoism` 指代框架本身
- keywords 新增 `cyber-taoism` 以扩大检索覆盖
- 技术标识符（npm 包名、域名、localStorage 键、GitHub URL）保持小写 `cyber-taoist` 不变
- `archive/` 历史版本保持原样

### 涉及范围（示例）

- 核心理论：`CONSTITUTION.md`（宪章 v1.0.1）、`DAO-DE-JING-CYBERTAOIST.md`（注疏 v1.0.3）、`README.md`
- 站点：`site/src/`（含 i18n、`llms.txt`、`SKILL.md`）及 `docs/` 构建输出
