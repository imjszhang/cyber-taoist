# V1 站点脚手架 — 变更说明

- 日期：2026-10-17
- 分支：`cursor/v1-discover-newsletter-scaffold-d887`
- 状态：可审 PR，不合并，不发版
- PR：待打开后补链接

## 改了什么

1. **Discover**：`content/discover/*.md` 走现有 Markdown → HTML 阅读管线，生成 `discover.html` 和 `discover/<slug>.html`。元数据至少要有 title、date、summary、tags、source、type。当前只有一篇 `placeholder`，正文标明 **PLACEHOLDER**，不是已发表文章。未发布条目带 `noindex`。
2. **首页 Explore**：放在身份介绍和 Practice 区块之后、Philosophy 之前。入口为 Latest Discoveries、三个主题锚点（AI Second Brain / Codex × PKM / Tools for Thought）、Newsletter。中英占位文案走原来的首页切换。
3. **Newsletter**：`newsletter.html`，定位 **AI × PKM Weekly**。订阅表单是禁用占位，没有外链 script / img。
4. 导航、sitemap 接上新页面。Philosophy、Practice、身份首屏和宪章原文没有改写。

## 怎么验

```bash
npm run site:validate
```

构建后打开 `dist/index.html`、`dist/discover.html`、`dist/discover/placeholder.html`、`dist/newsletter.html`。占位稿应能从首页走进去，来源字段可见，订阅按钮不可提交。

## 开放问题（请项目经理 / JS 拍板）

1. **Newsletter 选哪家？** 候选：Buttondown、Beehiiv，或不加载外部脚本的 form POST。`tools/check-site.js` 会拒绝 HTML 里的外链 script 和 img。在拍板前不要改白名单，也不要嵌第三方控件。
2. 真实订阅要不要作为 V1 验收？这一版按任务单只留骨架，测试邮箱还不能完成订阅。
3. Discover 的 URL 目前是 `discover.html` 和 `discover/<slug>.html`。没有加 Pages rewrite，所以没有无后缀的 `/discover`。
4. 种子稿：占位 1 篇，不是待审的 `2026-10-17-llm-wiki-vs-rag` 正文。正式英文稿仍等人审，这一 PR 不假装已经发布。
