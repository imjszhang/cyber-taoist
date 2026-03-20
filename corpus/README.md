# Corpus（外部系列）

存放**非日记体**的长文或外部素材：书籍章节、专栏连载、演讲稿整理等。与 `journal/`（按日期的个人笔记）并列，同属 Prism 的**原始素材层**。

运行 `npx js-knowledge-prism process`（或项目内等效命令）时，工具会扫描本目录，将各系列下的 Markdown 拆入 `pyramid/analysis/atoms/corpus-<系列名>/`，并在图谱中显示为 **corpus** 节点。

## 目录约定

- **一级子目录 = 一个系列**（名称自定，勿以下划线 `_` 开头；`_` 前缀目录会被工具忽略，可用于 `_template` 等辅助内容）。
- **系列内文章**：`.md` 文件，建议文件名以 **四位文章序号** 开头，便于 atom 编号与排序，例如：
  - `0001-preface.md`
  - `0010-chapter-three.md`
- **可选 `_series.md`**：放在该系列根目录，写入系列背景、阅读顺序、术语表等；处理该系列任意一篇时，内容会注入模型上下文，提高拆解一致性。

## 与 atoms 的对应关系

| 素材位置 | atoms 子目录 |
| -------- | ------------ |
| `journal/2026-03/xxx.md` | `pyramid/analysis/atoms/2026-03/` |
| `corpus/某系列/0010-foo.md` | `pyramid/analysis/atoms/corpus-某系列/` |

在 `pyramid/analysis/atoms/README.md` 的缩写映射表中，需为系列增加一行：`corpus:系列目录名` → 两位大写缩写（首篇处理时也可由模型分配）。

## 快速开始

1. 在 `corpus/` 下新建系列目录，例如 `corpus/my-series/`。
2. （推荐）复制 `_template/_series.md` 为 `corpus/my-series/_series.md` 并填写。
3. 放入文章 `.md` 文件。
4. 在 atoms README 映射表预留或补充 `corpus:my-series` 缩写（可选）。
5. 运行 Prism `process`；需要只跑某一系列时可使用 CLI 的 `--series` 参数（见 js-knowledge-prism 文档）。

## 与 flomo 导入脚本的关系

`scripts/flomo-import/` 面向 **journal** 流（短笔记 → 日记）。长文、连载更适合直接放入 **corpus** 对应系列，再走同一套 atoms → groups 流程。
