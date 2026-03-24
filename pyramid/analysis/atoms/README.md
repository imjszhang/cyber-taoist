# 信息单元（Atoms）

从每篇 **journal** 或 **corpus** 原始文档中提取的独立知识点。每个 atom 是不可再拆的最小信息单元。

## 编号规则

### Journal 来源

使用 `[缩写]-[序号]`：

- 缩写：取自 journal 文件名的简写（见下方映射表）
- 序号：两位数字，从 01 开始递增
- 示例：`AR-01` 表示某篇 journal 的第 1 个信息单元

### Corpus 来源

使用 `[缩写]-[文章序号]-[篇内序号]`（文章序号通常与文件名前四位数字一致）：

- 缩写：对应整个 **系列**（映射键为 `corpus:<系列目录名>`）
- 示例：`SK-0010-01` 表示系列缩写 `SK`、第 `0010` 篇文章、第 1 个 atom

## 缩写映射表

新增 journal 时，按「文件名 → 缩写」追加；新增 **corpus 系列** 时，追加一行 **系列映射**：

| 缩写 | journal 文件名 / corpus 系列键 | 月份 / atoms 子目录 |
| ---- | ------------------------------- | ------------------- |
| DJ | corpus:dao-de-jing | corpus-dao-de-jing |
| CN | corpus:constitution | corpus-constitution |
| DR   | dao-ch4-negative-feedback-rewrite     | 2026-03 |
| DC   | dao-ch5-annotation-refinement         | 2026-03 |

Journal 行：第二列为 **journal 文件名**（不含 `.md`），第三列为 `YYYY-MM`。Corpus 行：第二列为 **`corpus:<系列目录名>`**（与 `corpus/` 下文件夹名一致），第三列为 **`corpus-<系列目录名>`**（无尾斜杠）。工具解析表行格式为 `| XX | stem-or-key | month |`，其中 `XX` 须为两位大写字母。

## 子目录约定

### 按月（journal）

atoms 按 journal 日期的 `YYYY-MM` 归入子目录：

- journal `2026-01-31/xxx.md` → atoms `2026-01/xxx.md`
- journal `2026-02-08/xxx.md` → atoms `2026-02/xxx.md`

新增月份时创建新子目录即可。

### 按系列（corpus）

- `corpus/某系列/foo.md` → atoms `corpus-某系列/foo.md`
- 子目录名 **`corpus-`** 前缀与 `corpus/` 下文件夹名一一对应，由 js-knowledge-prism 在 process 时维护

## 信息单元分类

每个 atom 标注以下四种类型之一：

| 类型 | 说明                                 | 示例                                             |
| ---- | ------------------------------------ | ------------------------------------------------ |
| 事实 | 客观存在的概念、定义、架构描述       | "系统采用五层抽象架构"                           |
| 步骤 | 具体的操作方法、命令、配置过程       | "使用 `config set gateway.mode local` 设置模式"  |
| 经验 | 踩坑记录、最佳实践、非显而易见的发现 | "运行时依赖必须放在 dependencies"                |
| 判断 | 主观评估、可行性结论、取舍决策       | "该方案不适合资源受限环境，限制过大"             |

## Atom 文件模板

每个 atoms 文件遵循以下结构：

```markdown
# [原文标题]

> 来源：[../../journal/YYYY-MM-DD/xxx.md](相对路径) 或 [../../../../corpus/<系列>/<文件>.md](相对路径)
> 缩写：XX

## Atoms

| 编号  | 类型                         | 内容               | 原文定位         |
| ----- | ---------------------------- | ------------------ | ---------------- |
| XX-01 | 事实/步骤/经验/判断          | 信息单元的简明描述 | 章节名或行号范围 |
| XX-02 | ...                          | ...                | ...              |
```

Corpus 篇内编号列为 `XX-NNNN-01` 形式（`NNNN` 为文章序号，与 prism 约定一致）。
