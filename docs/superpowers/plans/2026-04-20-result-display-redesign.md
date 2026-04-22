# 结果展示重构：To-Do List 为主实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将结果展示从"四化分析为主"翻转为"To-Do List 为主、四化解读为辅"，四化逻辑内化到任务排序中，UI 不展示四化术语。

**Architecture:** 重写 ResultDisplay 组件，上部为纯净 To-Do List（checkbox + 任务 + 优先级 + 时间），底部为可折叠的四化解读区域。调整 prompt 和类型定义以移除 bestEntry/overallAdvice，actionPath 排序即推荐执行顺序。

**Tech Stack:** React + TypeScript + Tailwind CSS

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/types/index.ts` | Modify | `bestEntry`/`overallAdvice` 改为 optional |
| `src/utils/promptBuilder.ts` | Modify | 移除 bestEntry/overallAdvice 输出，新增排序要求 |
| `src/services/aiService.ts` | Modify | `validateAnalysisResult` 兼容可选字段 |
| `src/components/features/ResultDisplay/ResultDisplay.tsx` | Rewrite | To-Do List + 底部四化解读 |
| `src/components/features/HistoryList/HistoryList.tsx` | No change | 通过 ResultDisplay 间接兼容 |

---

### Task 1: 更新类型定义

**Files:**
- Modify: `src/types/index.ts:17-24`

- [ ] **Step 1: 将 `bestEntry` 和 `overallAdvice` 改为 optional**

将 `AnalysisResult` 接口中的 `bestEntry` 和 `overallAdvice` 标记为可选，兼容旧数据：

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

- [ ] **Step 2: 验证类型编译通过**

Run: `cd /Users/sankan/Coding/SoloCoder/schedule_assistant && npx tsc --noEmit 2>&1 | head -30`

Expected: 可能有 `ResultDisplay.tsx` 和 `aiService.ts` 的类型错误（因为 `bestEntry` 现在是可选的），这是预期的，后续 Task 会修复。

---

### Task 2: 更新 Prompt

**Files:**
- Modify: `src/utils/promptBuilder.ts`

- [ ] **Step 1: 重写 promptBuilder.ts**

移除 `bestEntry` 和 `overallAdvice` 的输出要求，新增 actionPath 排序规则。完整替换文件内容：

```typescript
import type { SihuaInfo, CollectedItem } from '../types';
import { STAR_MEANINGS } from '../constants/starMeanings';
import { SIHUA_DIMENSION_MEANINGS } from '../constants/sihuaRules';

export function buildAnalysisPrompt(
  task: string,
  sihuaInfo: SihuaInfo,
  collectedInfo: CollectedItem[] = []
): string {
  const { sihua, dayGan, dayGanZhi } = sihuaInfo;
  
  const luMeaning = STAR_MEANINGS[sihua.lu] || '';
  const quanMeaning = STAR_MEANINGS[sihua.quan] || '';
  const keMeaning = STAR_MEANINGS[sihua.ke] || '';
  const jiMeaning = STAR_MEANINGS[sihua.ji] || '';

  let collectedInfoSection = '';
  if (collectedInfo.length > 0) {
    const collectedInfoText = collectedInfo.map((item, index) =>
      `问题 ${index + 1}：${item.question}\n回答：${item.answer}`
    ).join('\n\n');
    
    collectedInfoSection = `
【已收集的补充信息】
通过多轮对话，用户提供了以下补充信息：

${collectedInfoText}

【重要提示】
请在分析任务时，充分考虑以上补充信息，生成更精准、更有针对性的任务拆分方案。
`;
  }

  return `【系统角色】
你是一位精通紫微斗数四化能量的任务管理专家，名叫"四化节奏师"。你的专长是将复杂任务拆解为最小可执行步骤，并结合当日的禄权科忌四星能量，给出个性化的行动建议。

【今日四化能量】
- 天干：${dayGan}
- 干支：${dayGanZhi}
- 化禄星：${sihua.lu} - ${SIHUA_DIMENSION_MEANINGS.lu}
  星曜含义：${luMeaning}
- 化权星：${sihua.quan} - ${SIHUA_DIMENSION_MEANINGS.quan}
  星曜含义：${quanMeaning}
- 化科星：${sihua.ke} - ${SIHUA_DIMENSION_MEANINGS.ke}
  星曜含义：${keMeaning}
- 化忌星：${sihua.ji} - ${SIHUA_DIMENSION_MEANINGS.ji}
  星曜含义：${jiMeaning}

【分析原则】
1. 禄星维度：今日最有机遇的方向，适合从这里入手获取资源
2. 权星维度：今日执行力最强的方向，适合推动和决策
3. 科星维度：今日最适合规划和系统化的方向
4. 忌星维度：今日需要特别注意的风险点，要谨慎或避免

【分析任务】
用户任务：${task}${collectedInfoSection}

【输出格式要求（严格JSON格式）】
{
  "summary": "一句话总结这个任务的核心",
  "fourDimensions": {
    "lu": {
      "star": "${sihua.lu}",
      "analysis": "禄星维度的详细分析",
      "actions": ["具体行动1", "具体行动2"]
    },
    "quan": {
      "star": "${sihua.quan}",
      "analysis": "权星维度的详细分析",
      "actions": ["具体行动1", "具体行动2"]
    },
    "ke": {
      "star": "${sihua.ke}",
      "analysis": "科星维度的详细分析",
      "actions": ["具体行动1", "具体行动2"]
    },
    "ji": {
      "star": "${sihua.ji}",
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

【重要要求】
1. 输出必须是严格的JSON格式，不要有任何额外的文字说明
2. actionPath 中的步骤必须是最小可执行单元，每个步骤都能独立完成
3. priority 只能是 "高"、"中"、"低" 三者之一
4. dimension 只能是 "lu"、"quan"、"ke"、"ji" 四者之一
5. actionPath 的步骤顺序即推荐执行顺序，第一个步骤必须对应最佳切入点的维度（禄/权/科之一）
6. 忌维度的步骤必须排在最后
7. 分析要结合当日具体的星曜，而不是泛泛而谈
8. 最少给出3个步骤，最多不超过8个步骤`;
}
```

- [ ] **Step 2: 验证编译**

Run: `cd /Users/sankan/Coding/SoloCoder/schedule_assistant && npx tsc --noEmit 2>&1 | head -30`

---

### Task 3: 更新 AI Service 验证逻辑

**Files:**
- Modify: `src/services/aiService.ts`

- [ ] **Step 1: 修改 `validateAnalysisResult` 函数**

将 `bestEntry` 和 `overallAdvice` 改为可选验证。找到 `validateAnalysisResult` 函数（约第 227 行），替换为：

```typescript
function validateAnalysisResult(data: unknown): AnalysisResult {
  console.group('🔍 [Data Validation] 开始验证 AI 响应格式');
  console.log('原始数据:', data);
  
  try {
    const obj = validateObject(data, 'root');
    
    const fourDimensionsData = obj.fourDimensions || obj.four_dimensions;
    const fourDimensionsObj = validateObject(fourDimensionsData, 'fourDimensions');
    
    const actionPathData = obj.actionPath || obj.action_path;
    const actionPathArray = validateArray(actionPathData, 'actionPath');

    let bestEntry: AnalysisResult['bestEntry'] = undefined;
    const bestEntryData = obj.bestEntry || obj.best_entry;
    if (bestEntryData) {
      try {
        const bestEntryObj = validateObject(bestEntryData, 'bestEntry');
        const bestEntryDimension = validateString(bestEntryObj.dimension, 'bestEntry.dimension');
        if (['lu', 'quan', 'ke'].includes(bestEntryDimension)) {
          bestEntry = {
            dimension: bestEntryDimension as 'lu' | 'quan' | 'ke',
            reason: validateString(bestEntryObj.reason, 'bestEntry.reason'),
            suggestion: validateString(bestEntryObj.suggestion, 'bestEntry.suggestion'),
          };
        }
      } catch {
        console.log('⚠️ bestEntry 验证失败，跳过（兼容旧数据）');
      }
    }

    let overallAdvice: string | undefined = undefined;
    try {
      overallAdvice = validateString(obj.overallAdvice || obj.overall_advice, 'overallAdvice');
    } catch {
      console.log('⚠️ overallAdvice 缺失，跳过（兼容旧数据）');
    }
    
    const result: AnalysisResult = {
      summary: validateString(obj.summary, 'summary'),
      bestEntry,
      fourDimensions: {
        lu: validateDimensionAnalysis(fourDimensionsObj.lu, 'lu'),
        quan: validateDimensionAnalysis(fourDimensionsObj.quan, 'quan'),
        ke: validateDimensionAnalysis(fourDimensionsObj.ke, 'ke'),
        ji: validateJiDimensionAnalysis(fourDimensionsObj.ji),
      },
      actionPath: actionPathArray.map((item, idx) => validateActionStep(item, idx)),
      overallAdvice,
    };
    
    console.log('✅ [Data Validation] 验证成功');
    console.groupEnd();
    return result;
  } catch (error) {
    console.log('❌ [Data Validation] 验证失败');
    console.log('错误:', error);
    console.groupEnd();
    throw error;
  }
}
```

- [ ] **Step 2: 验证编译**

Run: `cd /Users/sankan/Coding/SoloCoder/schedule_assistant && npx tsc --noEmit 2>&1 | head -30`

---

### Task 4: 重写 ResultDisplay 组件

**Files:**
- Rewrite: `src/components/features/ResultDisplay/ResultDisplay.tsx`

- [ ] **Step 1: 完整重写 ResultDisplay.tsx**

新组件结构：上部 To-Do List + 底部可折叠四化解读。UI 风格简约，不展示四化术语。

```typescript
import { useState } from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import type { AnalysisResult, ActionStep } from '../../../types';

interface ResultDisplayProps {
  result: AnalysisResult;
  onCopy?: () => void;
  onSave?: () => void;
  onReanalyze?: () => void;
}

const PRIORITY_LABELS: Record<string, string> = {
  '高': '高优',
  '中': '中优',
  '低': '低优',
};

const DIMENSION_META = {
  lu: { label: '化禄', color: 'emerald' },
  quan: { label: '化权', color: 'amber' },
  ke: { label: '化科', color: 'blue' },
  ji: { label: '化忌', color: 'red' },
} as const;

const DIMENSION_STYLES = {
  emerald: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  amber: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  blue: { dot: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
  red: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
};

function TodoItem({
  step,
  completed,
  onToggle,
}: {
  step: ActionStep;
  completed: boolean;
  onToggle: () => void;
}) {
  const isJi = step.dimension === 'ji';

  return (
    <div
      className={`flex items-start gap-3 py-3 ${
        completed ? 'opacity-50' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          completed
            ? 'bg-stone-800 border-stone-800'
            : 'border-stone-300 hover:border-stone-500'
        }`}
      >
        {completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-medium text-stone-800 leading-snug ${completed ? 'line-through' : ''}`}>
          {step.title}
        </p>
        <p className={`text-sm text-stone-500 mt-0.5 leading-relaxed ${completed ? 'line-through' : ''}`}>
          {step.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isJi
                ? 'bg-red-50 text-red-600'
                : step.priority === '高'
                ? 'bg-stone-100 text-stone-600'
                : step.priority === '中'
                ? 'bg-stone-50 text-stone-500'
                : 'bg-stone-50 text-stone-400'
            }`}
          >
            {isJi ? '提醒' : PRIORITY_LABELS[step.priority] || step.priority}
          </span>
          {!isJi && step.timeEstimate && (
            <span className="text-xs text-stone-400">{step.timeEstimate}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SihuaInsight({ result }: { result: AnalysisResult }) {
  const [expanded, setExpanded] = useState(false);
  const [detailDim, setDetailDim] = useState<string | null>(null);

  const dimensions = (['lu', 'quan', 'ke', 'ji'] as const).map((dim) => {
    const meta = DIMENSION_META[dim];
    const styles = DIMENSION_STYLES[meta.color];
    const data = result.fourDimensions[dim];
    return { dim, meta, styles, data };
  });

  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <span className="text-sm text-stone-500">为什么这样安排？</span>
        <span
          className={`text-stone-400 text-xs transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-stone-100">
          <div className="space-y-3 mt-4">
            {dimensions.map(({ dim, meta, styles, data }) => (
              <div key={dim}>
                <button
                  onClick={() => setDetailDim(detailDim === dim ? null : dim)}
                  className="w-full text-left"
                >
                  <div className="flex items-start gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} mt-1.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <span className={`text-sm font-medium ${styles.text}`}>
                        {meta.label}{data.star}
                      </span>
                      <p className="text-sm text-stone-600 mt-0.5 leading-relaxed">
                        {data.analysis}
                      </p>
                    </div>
                  </div>
                </button>

                {detailDim === dim && (
                  <div className={`mt-2 ml-4 p-3 rounded-lg ${styles.bg} ${styles.border} border`}>
                    {dim === 'ji' ? (
                      <div className="space-y-2">
                        {(data as any).warnings?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-600 mb-1">注意事项</p>
                            <ul className="space-y-1">
                              {(data as any).warnings.map((w: string, i: number) => (
                                <li key={i} className="text-xs text-stone-600">— {w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {(data as any).avoid?.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-red-500 mb-1">建议避免</p>
                            <ul className="space-y-1">
                              {(data as any).avoid.map((a: string, i: number) => (
                                <li key={i} className="text-xs text-stone-600">× {a}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      (data as any).actions?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-stone-600 mb-1">行动建议</p>
                          <ul className="space-y-1">
                            {(data as any).actions.map((a: string, i: number) => (
                              <li key={i} className="text-xs text-stone-600">→ {a}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

export function ResultDisplay({ result, onCopy, onSave, onReanalyze }: ResultDisplayProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(step)) {
        next.delete(step);
      } else {
        next.add(step);
      }
      return next;
    });
  };

  const todoItems = result.actionPath;
  const normalItems = todoItems.filter((s) => s.dimension !== 'ji');
  const reminderItems = todoItems.filter((s) => s.dimension === 'ji');

  return (
    <div className="space-y-4 w-full">
      <Card className="animate-scale-in" padding="lg">
        <h3 className="text-display text-lg font-semibold text-stone-800 mb-1">
          今日待办
        </h3>
        <p className="text-sm text-stone-400 mb-4">
          {result.summary}
        </p>

        <div className="divide-y divide-stone-100">
          {normalItems.map((step) => (
            <TodoItem
              key={step.step}
              step={step}
              completed={completedSteps.has(step.step)}
              onToggle={() => toggleStep(step.step)}
            />
          ))}
          {reminderItems.length > 0 && (
            <>
              <div className="py-2">
                <span className="text-xs text-stone-400 font-medium">提醒</span>
              </div>
              {reminderItems.map((step) => (
                <TodoItem
                  key={step.step}
                  step={step}
                  completed={completedSteps.has(step.step)}
                  onToggle={() => toggleStep(step.step)}
                />
              ))}
            </>
          )}
        </div>
      </Card>

      <div className="animate-slide-up">
        <SihuaInsight result={result} />
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        {onReanalyze && (
          <Button variant="secondary" onClick={onReanalyze}>
            重新分析
          </Button>
        )}
        {onSave && (
          <Button variant="secondary" onClick={onSave}>
            保存记录
          </Button>
        )}
        {onCopy && (
          <Button onClick={onCopy}>
            复制结果
          </Button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证编译**

Run: `cd /Users/sankan/Coding/SoloCoder/schedule_assistant && npx tsc --noEmit 2>&1 | head -30`

Expected: 0 errors

---

### Task 5: 构建验证与最终检查

- [ ] **Step 1: 运行完整构建**

Run: `cd /Users/sankan/Coding/SoloCoder/schedule_assistant && npm run build 2>&1 | tail -20`

Expected: 构建成功，无错误

- [ ] **Step 2: 检查 HistoryList 兼容性**

确认 `HistoryList.tsx` 中使用 `ResultDisplay` 组件时不需要修改。`HistoryList` 传递 `result: selectedRecord.result` 给 `ResultDisplay`，由于 `bestEntry` 和 `overallAdvice` 已改为 optional，旧数据仍能正常渲染。

Run: `cd /Users/sankan/Coding/SoloCoder/schedule_assistant && npx tsc --noEmit 2>&1 | head -10`

Expected: 0 errors

- [ ] **Step 3: 提交代码**

```bash
cd /Users/sankan/Coding/SoloCoder/schedule_assistant && git add -A && git commit -m "refactor: 结果展示重构 - To-Do List 为主，四化解读为辅"
```
