# Flomo 素材导入指南

> **版本**：v1.0.0
> **创建**：2026-03-18
> **更新**：2026-03-18

## 背景与目标

cyber-taoist 理论的核心公式为 **进化 = f(R, T, N)**：

- **R** (Rules) — 环境规则 / 筛选压力
- **T** (Transaction) — 价值创造方式
- **N** (Niche) — 生态位占据状态

理论素材大量散落在 flomo 笔记中（通过 `js-knowledge-flomo` 项目访问）。本套脚本的目标是系统化地从 flomo 中发现、筛选、导入与 R×T×N 理论相关的笔记，充实 cyber-taoist 的知识库（journal → atoms → groups → synthesis）。

---

## 设计原则：人机分工

经过讨论，确定了一条核心原则：**搜索和格式化交给机器，归类和解读留给人。**

判断标准是"这步出错的后果是什么"：

| 环节 | 出错后果 | 执行者 |
|------|----------|--------|
| 搜索（从 flomo 捞候选） | 最多漏捞，不污染理论，可重来 | 脚本 |
| 粗筛评分排序 | 排序不准而已，人还会终审 | 脚本 |
| 判断是否纳入 | 直接影响理论素材质量 | **人** |
| 标注维度（R/T/N）和所属 group | 错误会扭曲理论结构 | **人** |
| 写一句话解读 | 体现理论构建者的理解 | **人** |
| 生成 journal + atom 文件 | 格式错了好修，不影响理论 | 脚本 |
| 更新 group / synthesis | 理论走形风险高 | **人** |

---

## 管道总览

```
search-flomo.mjs ──→ candidates JSON ──→ generate-review.mjs ──→ review markdown
                                                                       │
                                                                  人工审阅标注
                                                                       │
                                                              generate-atoms.mjs
                                                                       │
                                                            journal/ + atoms/ 文件
                                                                       │
                                                              人工更新 groups/synthesis
```

---

## 文件结构

```
scripts/
└── flomo-import/
    ├── search-config.json        # 搜索策略配置
    ├── search-flomo.mjs          # 脚本 1：批量搜索 + 去重
    ├── generate-review.mjs       # 脚本 2：评分 + 生成审阅文件
    ├── generate-atoms.mjs        # 脚本 3：解析审阅 → 生成 journal + atom
    ├── docs/
    │   └── flomo-import-guide.md # 本文档
    └── data/                     # 中间产物（已 gitignore）
        ├── candidates-YYYY-MM-DD.json
        └── review-YYYY-MM-DD.md
```

---

## 使用步骤

### 前提条件

- Node.js >= 18
- `js-knowledge-flomo` 已完成 flomo OAuth 授权（`node cli/cli.js auth`）
- `search-config.json` 中的 `flomoCliPath` 指向正确的 js-knowledge-flomo 目录

### 第一步：批量搜索

```bash
npm run search
# 或：node scripts/search-flomo.mjs
```

脚本按 `search-config.json` 中定义的关键词和标签逐条搜索 flomo，去重后输出到 `scripts/data/candidates-YYYY-MM-DD.json`。

输出示例：
```
搜索: keyword:"规则" ... 50 条
搜索: keyword:"认知" ... 50 条
搜索: tag:"生态位" ... 50 条
...
完成: 557 条去重候选 (从 674 条原始结果)
```

### 第二步：生成审阅文件

```bash
npm run review
# 或：node scripts/generate-review.mjs [candidates文件路径]
```

脚本读取候选 JSON，按 R/T/N 关键词命中数评分，生成 `scripts/data/review-YYYY-MM-DD.md`。零分候选自动过滤。不传参数时默认读取最新的 candidates 文件。

### 第三步：人工审阅（核心环节）

打开 `scripts/flomo-import/data/review-YYYY-MM-DD.md`，从高分到低分逐条审阅。

对每条候选，需要做四个决定：

```markdown
- 纳入: [x]              ← 把 [ ] 改为 [x] 表示纳入
- 维度: R                 ← 确认或修改：R / T / N
- 类型: 判断              ← 填写：事实 / 经验 / 判断 / 步骤
- 一句话解读: 这条笔记对理论意味着什么
```

**审阅建议**：

- 高分排在前面，可以从上往下看，觉得质量不够时随时停
- 不是所有 flomo 笔记都值得进 cyber-taoist，只有能回答"R/T/N 中某个变量怎么运作"的才值得纳入
- 同一条笔记归到不同维度，代表对理论的不同理解，请慎重选择
- 解读不要复述原文，而是写"这条笔记对 R×T×N 理论意味着什么"

### 第四步：生成 atom 文件

```bash
npm run atoms
# 或：node scripts/generate-atoms.mjs [review文件路径]
```

脚本解析审阅文件中所有 `纳入: [x]` 的条目，按维度分组，生成：

- `journal/YYYY-MM-DD/flomo-import-{R|T|N}.md` — 原始素材存档
- `pyramid/analysis/atoms/YYYY-MM/flomo-import-{R|T|N}.md` — 格式化 atom 文件

缩写对照：FR = flomo-import-R，FT = flomo-import-T，FN = flomo-import-N。

### 第五步：人工收尾

脚本生成 atom 后，需要手动完成：

1. **更新缩写映射表**：`pyramid/analysis/atoms/README.md` 中追加 FR/FT/FN
2. **归入 group**：将新 atom 条目添加到 `pyramid/analysis/groups/` 对应的 group 文件中
3. **检查 synthesis**：`pyramid/analysis/synthesis.md` 是否需要调整顶层观点

---

## 搜索配置说明

`search-config.json` 包含三部分：

### searches — 搜索项

每项可指定 `keyword`（内容搜索）和/或 `tag`（标签筛选）：

```json
{ "keyword": "规则" }         // 按关键词搜索
{ "tag": "生态位" }           // 按标签搜索
{ "keyword": "套利", "tag": "想法" }  // 组合搜索
```

### searchDefaults — 搜索默认参数

```json
{ "limit": 50 }              // 每次搜索最多返回条数
```

### scoring — R/T/N 评分关键词

每个维度一组关键词，用于对候选笔记评分和建议维度归属：

```json
{
  "R": ["规则", "认知", "恐惧", "未知", "合规", "变化", "判断", "T-1", "环境", "压力", "筛选", "风险", "约束"],
  "T": ["共识", "资格", "数量", "财富", "价值", "交易", "套利", "生产", "期权", "杠杆", "现金流", "价格", "故事"],
  "N": ["生态位", "基本盘", "需求", "竞争", "挤占", "诅咒", "分化", "抢占", "占据", "生态", "组织", "权力"]
}
```

随着理论发展，可随时扩充关键词和搜索项。

---

## 扩展搜索策略建议

首轮搜索已覆盖核心术语。后续可按以下优先级扩展：

1. **R 维度优先**（当前素材最薄）：搜索"合规"、"法规"、"政策"、"制度"等
2. **T 维度补充**：搜索"商业模式"、"定价"、"IP"等
3. **N 维度补实证**：搜索历史人物、朝代、公司名等具体案例
4. **AI 相关**：搜索"AI"、"人工智能"、"大模型"，补充"分化时刻"素材
5. **利用 flomo 标签树**：运行 `node cli/cli.js tags` 查看完整标签体系，发现未覆盖的分支

---

## 技术细节

- 脚本均为 Node.js ESM（`.mjs`），通过子进程调用 `js-knowledge-flomo` CLI，两个项目保持解耦
- 无外部 npm 依赖，仅使用 `child_process`、`fs`、`path` 等内置模块
- `scripts/data/` 目录已加入 `.gitignore`，中间产物不入库
- atom 文件格式严格遵循 `pyramid/analysis/atoms/README.md` 的模板规范

---

## 变更记录

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0.0 | 2026-03-18 | 初版：三脚本管道（search → review → atoms）、搜索配置、审阅流程、扩展策略 |
