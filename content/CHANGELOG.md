# 内容版本记录

`content/` 是 Cyber-Taoist 理论内容的唯一真相源。内容版本通过 Git 提交、Git tag 与本文件共同管理；不再为每次内容迭代复制一份全文到 `archive/`。

## 版本管理约定

- 日常内容修改直接提交 `content/*.md`。
- 重要内容版本发布时创建 Git tag，建议格式为 `<document>-v<version>`，例如 `guide-v2.0.0`、`constitution-v1.0.1`。
- 旧版本通过 GitHub tag 或 commit permalink 查看。
- `archive/` 仅保留迁移到 Git/tag 版本管理前的旧快照，不再新增内容版本。

## 当前内容版本

| 文档 | 当前版本 | 文件 | 说明 |
|------|----------|------|------|
| 进化学宪章 | v1.0.1 | [`CONSTITUTION.md`](CONSTITUTION.md) | Cyber-Taoist 进化学公理体系 |
| 道德经 · 进化学注疏 | v1.0.3 | [`DAO-DE-JING-CYBERTAOIST.md`](DAO-DE-JING-CYBERTAOIST.md) | 《道德经》八十一章系统性注疏 |
| 道德经原文 | 无独立版本 | [`DAO-DE-JING.md`](DAO-DE-JING.md) | 注疏底本 |
| 进化学应用指南 | v2.0.0 | [`GUIDE.md`](GUIDE.md) | N/R/T/EC/NI 五元分析框架的操作指南 |
| LLM 索引 | 随内容更新 | [`llms.txt`](llms.txt) | 供 LLM/爬虫读取的站点索引 |

## 旧快照迁移说明

`archive/cybertaoist-docs-history/` 保留以下迁移前快照：

- `CONSTITUTION/initial.md`
- `DAO-DE-JING-CYBERTAOIST/initial.md`
- `DAO-DE-JING-CYBERTAOIST/v1-0-1.md`
- `DAO-DE-JING-CYBERTAOIST/v1-0-2.md`
- `GUIDE/v1-0-0.md`

后续若需要标记新内容版本，优先创建 Git tag，而不是新增 archive 快照。
