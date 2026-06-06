# 架构变更日志

记录知识库**架构**（目录结构、方法论、工作流程）的变更。日常内容写入不记录在此。

版本规则见 [README — 版本管理](README.md#版本管理)。

## V2.1.0 — 2026-06-06

拆分单体 `index.html`，保留无框架静态站点形态，同时降低页面维护成本。

### 变更

- 将 `site/src/index.html` 拆为主模板 + `site/src/partials/`
- 将内联配色样式抽出到 `site/src/styles/scheme.css`
- 将底部交互脚本抽出到 `site/src/js/app.js`
- 构建脚本支持 `<!-- @include partials/*.html -->` 模板拼接
- 将公开应用指南文件名从 `SKILL.md` 改为 `GUIDE.md`
- 将历史归档目录 `archive/cybertaoist-docs-history/SKILL/` 重命名为 `GUIDE/`
- 新增 GitHub Actions Pages workflow，推送到 `main` 后自动构建并部署
- 构建产物目录从 `docs/` 改为 `dist/`，不再作为源码提交
- Pages 配置脚本默认使用 `workflow` 构建模式

## V2.0.0 — 2026-06-06

目录层次重组：分离理论内容、站点代码与工具脚本。

### 变更

- 新增 `content/` 作为理论 Markdown 与 `llms.txt` 的唯一真相源
- `site/src/` 调整为站点代码目录，不再提交内容 Markdown
- 合并 `build/`、`cli/`、`scripts/` 为 `tools/`
- 构建流程改为复制 `site/src/` 代码并从 `content/` 发布内容文件
- dev 预览改为先构建到 `dist/` 再启动本地服务
- 新增 `content:sync` 脚本，可按需从 `content/` 同步公开内容到 `site/src/`
- `package.json` 的 CLI 与 npm scripts 全部指向 `tools/`

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
- 站点：`site/src/`（含 i18n、`llms.txt`、应用指南）及 `docs/` 构建输出
