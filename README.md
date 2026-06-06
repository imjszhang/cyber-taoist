# CYBER-TAOIST

> **控制论 × 道家自然观**

以控制论反馈机制重新解读道家自然观的操作化思想框架 —— 探索天道(N)、法则(R)与交易(T)的进化动力学。

🌐 **在线站点**：[cyber-taoist.ai](https://cyber-taoist.ai)　|　📂 **架构版本**：V2.1.0 · [变更日志](CHANGELOG.md)

---

## 进化学宪章

宇宙万物流变不息，生存为一切主体之元规则。本宪章立 Cyber-Taoist 进化学之根本，明分形结构之自相似，述生存、规则、交易、生态、生态位之奥义。

| 条目 | 符号 | 概念 | 要义 |
|------|------|------|------|
| 第一条 | — | **生存** | 一切主体的根本驱动力与终极目标。任何无法维持自身存在之主体，必被淘汰 |
| 第二条 | **N** | **自然** | 客观环境及其内在演化法则——天道。不可违背、不可观测，只能通过后果感知 |
| 第三条 | **R** | **法则** | 主体构建的规则、文化、技术、制度。对天道的近似模拟，永远滞后。功能为防火墙 |
| 第四条 | **T** | **交易** | 主体感知天道的主要途径。与环境及其他主体之间的交互与反馈过程。防火墙内外的动态探头 |
| 第五条 | **EC** | **生态** | 由主体及其法则(R)和交易(T)共同构建的动态场域。每一生态本身亦为更高层次的主体 |
| 第六条 | **NI** | **生态位** | 主体在生态中的功能定位。反映主体与法则的相容程度。随法则变化与交易策略调整而动态漂移 |

→ [阅读完整宪章](content/CONSTITUTION.md) · [在线版](https://cyber-taoist.ai/CONSTITUTION.md)

---

## 内容产出

| 产出 | 说明 | 链接 |
|------|------|------|
| **道德经 · 进化学注疏** | 以 Cyber-Taoist 进化学框架对《道德经》八十一章的系统性注疏 —— 揭示道家思想与控制论反馈的结构性同构 | [content/DAO-DE-JING-CYBERTAOIST.md](content/DAO-DE-JING-CYBERTAOIST.md) |
| **进化学宪章** | Cyber-Taoist 进化学的公理体系 —— 二十条基本法则，从生存驱动到代谢淘汰的完整进化论述 | [content/CONSTITUTION.md](content/CONSTITUTION.md) |

---

## 项目结构

```
content/      # 理论内容（Markdown 与 llms.txt 的唯一真相源）
site/src/     # 站点源码（HTML 模板、片段、样式、脚本、图片）
dist/         # 构建输出（本地预览与 GitHub Actions 发布产物，不提交）
journal/      # 开发笔记，按日期记录探索过程
archive/      # 核心理论文档的历史版本
tools/        # 构建、内容同步、CLI 与部署脚本
```

| 目录 | 说明 |
|------|------|
| [content/](content/) | 宪章、道德经原文、进化学注疏、GUIDE 与 LLM 索引 |
| [site/src/](site/src/) | 站点代码：主模板、partials、CSS、JS 与图片 |
| [tools/](tools/) | `build`、`sync-content`、CLI 与部署配置 |
| [journal/](journal/) | 按日期记录的开发笔记 |
| [archive/](archive/) | 宪章、注疏、指南等文档的历史快照 |

---

## 开发

```bash
# 本地预览站点
npm run site:preview

# 开发模式（先构建到 dist/，再启动本地服务）
npm run site:dev

# 构建站点到 dist/（渲染 partials，并复制 content/）
npm run site:build

# 如需把 content/ 同步到 site/src/ 做静态文件调试
npm run content:sync

# CLI
npm run cli -- help
```

---

## 部署

GitHub Pages 使用 GitHub Actions 自动构建发布。推送到 `main` 后，`.github/workflows/pages.yml` 会执行 `npm run site:build`，上传 `dist/` 作为 Pages artifact，并部署到站点。

仓库的 Pages Source 需设置为 **GitHub Actions**。`dist/` 是构建产物，已加入 `.gitignore`，不要手动提交。

```bash
# 本地验证构建产物
npm run site:build

# 可选：配置自定义域名与 Pages workflow 模式
npm run gh:pages
```

---

## 版本管理

架构版本采用语义化版本号 `MAJOR.MINOR.PATCH`，跟踪的是**架构本身**（目录结构、方法论、工作流程），而非内容：

| 版本段 | 变更范围 | 示例 |
|--------|---------|------|
| MAJOR | 架构范式变更（项目定位、目录层次重组） | 弃用知识管线、站点与内容分离 |
| MINOR | 新增结构组件或显著的工作流调整 | 引入 CI 自动部署、拆分 HTML 片段 |
| PATCH | 模板微调、README 补充、目录命名规范等小幅改动 | 模板字段增删、导航链接修正 |

日常内容写入（新增 journal、更新理论文档等）不触发版本变更。

→ [完整变更日志](CHANGELOG.md)
