# V1 站点脚手架 — 变更说明

- 日期：2026-10-17
- 分支：`cursor/v1-discover-newsletter-scaffold-d887`
- 状态：可审 PR，不合并，不发版
- PR：https://github.com/imjszhang/cyber-taoist/pull/1（草稿，不合并）

## 改了什么

1. **Discover**：`content/discover/*.md` 走现有 Markdown → HTML 阅读管线，生成 `discover.html` 和 `discover/<slug>.html`。元数据至少要有 title、date、summary、tags、source、type。当前只有一篇 `placeholder`，正文标明 **PLACEHOLDER**，不是已发表文章。未发布条目带 `noindex`。
2. **首页 Explore**：放在身份介绍和 Practice 区块之后、Philosophy 之前。入口为 Latest Discoveries、三个主题锚点（AI Second Brain / Codex × PKM / Tools for Thought）、Newsletter。中英占位文案走原来的首页切换。
3. **Newsletter**：`newsletter.html`，定位 **AI × PKM Weekly**。订阅表单保持禁用。这一版不接邮件服务，也没有外链 script / img。
4. 导航、sitemap 接上新页面。Philosophy、Practice、身份首屏和宪章原文没有改写。

## 怎么验

```bash
npm run site:validate
```

构建后打开 `dist/index.html`、`dist/discover.html`、`dist/discover/placeholder.html`、`dist/newsletter.html`。占位稿应能从首页走进去，来源字段可见，订阅按钮不可提交。

## JS 决定（2026-10-17）

1. Newsletter 这一版只做落地页，不接任何邮件服务。
2. V1 不要求测试邮箱完成真实订阅。
3. 地址保持 `*.html`（`discover.html`、`discover/<slug>.html`、`newsletter.html`），不加 Pages rewrite。

正式 Discover 正文仍等审稿之后的单独任务。当前这篇 `placeholder` 不是待审的 `2026-10-17-llm-wiki-vs-rag`，也不当作已发布文章。
