# 架构变更日志

记录知识库**架构**（目录结构、方法论、工作流程）的变更。日常内容写入不记录在此。

版本规则见 [README — 版本管理](README.md#版本管理)。

## Unreleased — V1 内容入口脚手架

尚未发版。这一笔只记录站点脚手架，不改公理、宪章或实践笔记的行为。

- 新增 Discover 列表 `discover.html` 与文章模板 `discover/<slug>.html`，稿件目录为 `content/discover/`。当前只有一篇标明 PLACEHOLDER 的占位稿，不是已发布内容。
- 首页在身份介绍与 Practice 区块之后增加 Explore 入口，含 Discover 主题锚点与 Newsletter。文案为占位，沿用首页中英切换。
- 新增 `newsletter.html`（AI × PKM Weekly）。2026-10-17 JS 定案：这一版只做落地页，不接邮件服务，不要求真实订阅，地址保持 `*.html`。表单保持禁用，没有外部脚本。

## V2.2.0 — 2026-10-06

- 首页以 Cyber-Taoist 人的身份为主线，采用黑金英文设计，保留中文切换与手机布局。
- 新增 `philosophy.html`，以 Cyber-Taoism 命名思想体系，保留原有概念、宪章及应用阅读功能。
- 新增本地实践笔记：自动保存、Markdown 导出、复制与清空草稿；不需要账号或后端。
- 首页字体和三张插画保存到站点资源目录，生成提示词与来源单独记录。
- 构建程序扩展为处理所有顶层 HTML 页面；理论原始文档保持原文。
- 思想页与首页统一使用本地黑金样式，移除运行时外部字体、Tailwind 和 Three.js 依赖。
- 由原始 Markdown 构建指南、注疏、道德经原文及宪章阅读页，带章节目录、复制与下载。
- 构建时自动生成手机与桌面 WebP 插画；桌面三张插画从约 5.7 MB 降至 653 KB。
- 加入固定依赖版本、构建检查、原文完整性检查、站内链接检查及 PR 验证；通过检查后发布。
- 增加站点地图、robots.txt、404 页面与版本信息，支持上线核验。

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
- 新增 `content/CHANGELOG.md`，内容版本改由 Git 提交、Git tag 与内容版本记录管理
- `archive/` 降级为迁移前旧快照目录，后续不再新增内容版本

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
- 站点：`site/src/`（含 i18n 与应用指南入口）及 `dist/` 构建输出
