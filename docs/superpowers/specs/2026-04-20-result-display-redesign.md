# 结果展示重构：以 To-Do List 为主、四化解读为辅

**版本**：v1.0
**日期**：2026-04-20
**状态**：待评审

---

## 1. 背景与目标

### 1.1 现状问题

当前 [ResultDisplay.tsx](file:///Users/sankan/Coding/SoloCoder/schedule_assistant/src/components/features/ResultDisplay/ResultDisplay.tsx) 的展示结构以四化分析为核心：

1. **最佳切入点**（顶部卡片）
2. **四维深度分析**（禄/权/科/忌四个可展开区域）
3. **最小行动路径**（步骤时间线）
4. **综合建议**（文本卡片）

这种结构让用户首先看到的是四化维度的分析，而非可执行的任务清单。四化术语对不熟悉紫微斗数的用户来说有认知门槛，且偏离了"帮我拆分任务"的核心诉求。

### 1.2 重构目标

将结果展示从"四化分析为主、行动建议为辅"翻转为"**To-Do List 为主、四化解读为辅**"：

- **To-Do List 是主角**：用户第一眼看到的是干净、可执行的待办清单，不含任何四化术语
- **四化是幕后逻辑**：四化能量决定了生成哪些任务、按什么顺序排列，但用户无需在清单中感知
- **四化解读是补充**：底部可折叠区域提供"为什么这样安排"的解释，供好奇的用户深入了解

### 1.3 核心原则

1. **内化而非展示**：四化逻辑内化到任务排序和内容生成中，而非作为标签展示
2. **纯净的清单体验**：To-Do List 不含禄/权/科/忌等术语，看起来就是一个普通的待办清单
3. **好奇心驱动探索**：四化解读默认收起，用户主动点击才展开

---

## 2. 设计方案

### 2.1 新页面结构

```
┌─────────────────────────────────────────┐
│  📋 今日待办                             │
│  ─────────────────────────────────────  │
│                                         │
│  ☐ 列出需要访谈的用户名单                 │
│    高优 · 约15分钟                        │
│                                         │
│  ☐ 预约3位核心用户的访谈时间              │
│    高优 · 约20分钟                        │
│                                         │
│  ☐ 整理访谈提纲和记录模板                 │
│    中优 · 约30分钟                        │
│                                         │
│  ☐ 避免公开汇报和高调宣传                 │
│    提醒                                   │
│                                         │
├─────────────────────────────────────────┤
│  ▾ 为什么这样安排？                      │
│                                         │
│  今日甲子日，四化能量：                    │
│  化禄廉贞 → 机遇在社交和技术，适合从      │
│           人脉资源入手开启任务             │
│  化权破军 → 执行力在突破变革，适合推动    │
│           需要决断的环节                   │
│  化科武曲 → 适合务实规划，系统化整理      │
│  化忌太阳 → 公开表现需谨慎，避免过度展示  │
│                                         │
│  [展开查看每个维度的详细分析 →]            │
└─────────────────────────────────────────┘
```

### 2.2 To-Do List 区域

**展示内容**：
- Checkbox（可点击切换完成态，纯本地状态，不持久化）
- 任务标题（即 `actionPath[].title`）
- 任务描述（即 `actionPath[].description`，作为副文本展示）
- 优先级标签：高优 / 中优 / 低优 / 提醒
- 预估时间（如"约15分钟"）

**不展示的内容**：
- 四化维度标签（禄/权/科/忌）
- 四化星曜名称
- 任何紫微斗数术语

**排序逻辑**：
- `actionPath` 的顺序即推荐执行顺序
- 第一个待办项 = 最佳切入点（由 AI 在 prompt 中按此逻辑排列）
- 忌维度的提醒项排在最后

**优先级标签映射**：
- `priority: "高"` → "高优"
- `priority: "中"` → "中优"
- `priority: "低"` → "低优"
- 忌维度的项 → "提醒"（不显示优先级）

**完成态交互**：
- 点击 checkbox 切换完成/未完成
- 完成态：标题加删除线，整行降低透明度
- 完成态不持久化，刷新页面恢复

### 2.3 底部"为什么这样安排"区域

**默认状态**：收起，只显示标题行 `▾ 为什么这样安排？`

**展开后第一层**：四化能量概览
- 今日天干和干支
- 四个维度各一行：`化禄廉贞 → 一句话核心解读`
- 解读内容来自 `fourDimensions` 中的 `analysis` 字段，截取核心一句

**展开后第二层**（可选）：每个维度的详细分析
- 点击某个维度可展开查看完整分析 + 行动建议/注意事项
- 复用现有 `fourDimensions` 数据
- 禄/权/科展示 `actions` 列表
- 忌展示 `warnings` 和 `avoid` 列表

### 2.4 删除的 UI 区域

| 原区域 | 处理方式 |
|--------|----------|
| 最佳切入点卡片 | 删除，逻辑内化到 actionPath 排序 |
| 四维深度分析 | 移到底部可折叠区域 |
| 最小行动路径 | 替换为 To-Do List |
| 综合建议 | 移除，核心信息已融入 To-Do 和底部解读 |

---

## 3. 数据结构变更

### 3.1 AnalysisResult 类型

```typescript
export interface AnalysisResult {
  summary: string;
  fourDimensions: {
    lu: DimensionAnalysis;
    quan: DimensionAnalysis;
    ke: DimensionAnalysis;
    ji: JiDimensionAnalysis;
  };
  actionPath: ActionStep[];
}
```

**变更点**：
- 移除 `bestEntry` 字段（排序逻辑内化到 actionPath 顺序）
- 移除 `overallAdvice` 字段（不再需要单独的综合建议）

### 3.2 ActionStep 类型

```typescript
export interface ActionStep {
  step: number;
  title: string;
  description: string;
  dimension: 'lu' | 'quan' | 'ke' | 'ji';
  priority: '高' | '中' | '低';
  timeEstimate: string;
}
```

**不变**：`dimension` 字段保留，作为内部逻辑使用（决定底部解读区域的关联），但 UI 不展示。

### 3.3 DimensionAnalysis / JiDimensionAnalysis

不变，保持现有结构。

---

## 4. Prompt 变更

### 4.1 promptBuilder.ts 调整

**移除**：
- `bestEntry` 相关的输出格式要求

**新增/调整**：
- 明确要求 AI 按最佳切入点优先的顺序排列 `actionPath`
- 第一个步骤必须是最佳切入点的行动
- 忌维度的步骤排在最后
- `overallAdvice` 不再需要输出

**调整后的输出格式**：

```json
{
  "summary": "一句话总结这个任务的核心",
  "fourDimensions": {
    "lu": {
      "star": "星曜",
      "analysis": "禄星维度的详细分析",
      "actions": ["具体行动1", "具体行动2"]
    },
    "quan": {
      "star": "星曜",
      "analysis": "权星维度的详细分析",
      "actions": ["具体行动1", "具体行动2"]
    },
    "ke": {
      "star": "星曜",
      "analysis": "科星维度的详细分析",
      "actions": ["具体行动1", "具体行动2"]
    },
    "ji": {
      "star": "星曜",
      "analysis": "忌星维度的详细分析",
      "warnings": ["注意事项1", "注意事项2"],
      "avoid": ["建议避免的行动1", "建议避免的行动2"]
    }
  },
  "actionPath": [
    {
      "step": 1,
      "title": "步骤标题",
      "description": "具体内容",
      "dimension": "lu",
      "priority": "高",
      "timeEstimate": "30分钟"
    }
  ]
}
```

**新增重要要求**：
- actionPath 的第一个步骤必须对应最佳切入点的维度（禄/权/科之一）
- 忌维度的步骤必须排在最后
- 步骤顺序即推荐执行顺序

---

## 5. 组件变更

### 5.1 ResultDisplay.tsx 重写

**整体结构**：

```
ResultDisplay
├── TodoListCard          // 主卡片：To-Do List
│   ├── TodoItem[]        // 各待办项
│   └── (checkbox 交互)
└── SihuaInsightCard      // 底部卡片：四化解读
    ├── SihuaOverview     // 第一层：四化概览
    └── SihuaDetail[]     // 第二层：各维度详细分析
```

**TodoItem 组件**：
- Props: `step: ActionStep`, `completed: boolean`, `onToggle: () => void`
- 展示：checkbox + title + description + 优先级标签 + 预估时间
- 忌维度项：优先级显示为"提醒"，无预估时间，样式用红色系

**SihuaInsightCard 组件**：
- Props: `fourDimensions`, `dayGanZhi`
- 状态：`expanded: boolean`（第一层展开），`detailExpanded: Set<string>`（第二层各维度展开）
- 第一层：四化星曜 + 一句话解读
- 第二层：点击某维度展开详细分析

### 5.2 移除的组件/代码

- `bestEntry` 相关的所有 UI 代码
- `overallAdvice` 相关的 UI 代码
- `DIMENSION_INFO`、`DIMENSION_COLORS` 常量中用于最佳切入点卡片的逻辑（保留用于底部解读区域）

---

## 6. 历史记录兼容性

### 6.1 旧数据兼容

已保存的历史记录中包含 `bestEntry` 和 `overallAdvice` 字段。处理策略：

- `ResultDisplay` 组件不依赖这两个字段，忽略即可
- 类型定义中移除这两个字段，但读取旧数据时不报错（TypeScript 可选属性）
- 历史记录的 `result` 字段类型保持宽松：`bestEntry` 和 `overallAdvice` 标记为 optional

### 6.2 类型调整

```typescript
export interface AnalysisResult {
  summary: string;
  bestEntry?: {
    dimension: 'lu' | 'quan' | 'ke';
    reason: string;
    suggestion: string;
  };
  fourDimensions: {
    lu: DimensionAnalysis;
    quan: DimensionAnalysis;
    ke: DimensionAnalysis;
    ji: JiDimensionAnalysis;
  };
  actionPath: ActionStep[];
  overallAdvice?: string;
}
```

`bestEntry` 和 `overallAdvice` 标记为 optional，兼容旧数据。新数据不再包含这两个字段。

---

## 7. 涉及文件清单

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `src/components/features/ResultDisplay/ResultDisplay.tsx` | 重写 | 新的 To-Do List + 底部四化解读布局 |
| `src/utils/promptBuilder.ts` | 修改 | 移除 bestEntry/overallAdvice，调整排序要求 |
| `src/types/index.ts` | 修改 | bestEntry/overallAdvice 改为 optional |
| `src/services/aiService.ts` | 检查 | 确认 JSON 解析逻辑兼容新格式 |
| `src/pages/Home.tsx` | 微调 | 移除对 bestEntry/overallAdvice 的依赖（如有） |
| `src/components/features/HistoryList/HistoryList.tsx` | 检查 | 确认历史记录展示兼容 |

---

## 8. 不在范围内

- To-Do List 完成态的持久化存储
- To-Do List 的拖拽排序
- 四化解读区域的动画效果（保持简单过渡即可）
- Prompt 的深度优化（仅做结构适配，不改变分析质量）
