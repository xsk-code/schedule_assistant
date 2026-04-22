# 四化节奏师 · Sihua Rhythm Master

基于紫微斗数四化能量的 AI 任务拆分与行动助手。根据当日天干所对应的禄、权、科、忌四化星曜，结合大语言模型，将复杂任务智能拆解为可执行的行动步骤，并给出个性化的能量指引。

## ✨ 核心功能

- **四化能量计算** — 根据公历日期自动推算农历、天干地支及当日四化（化禄、化权、化科、化忌）
- **AI 智能分析** — 将任务与当日四化能量结合，从禄（机遇）、权（执行）、科（规划）、忌（风险）四个维度生成行动建议
- **多轮对话思考模式** — AI 主动追问关键信息，通过多轮对话收集上下文，生成更精准的拆分方案
- **行动路径生成** — 输出带优先级、时间估算、维度归属的结构化行动步骤
- **历史记录** — 保存分析结果，支持回顾与复用历史任务
- **多模型支持** — 支持 DeepSeek、GPT-4o Mini、Qwen、Llama、GLM 等多种大模型

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 + TypeScript |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3 |
| 历法计算 | lunar-javascript（lunar.js） |
| AI 接口 | SiliconFlow API（OpenAI 兼容格式） |

## 📁 项目结构

```
src/
├── components/
│   ├── common/          # 通用组件（Button, Card, Loading）
│   ├── features/
│   │   ├── HistoryList/     # 历史记录列表
│   │   ├── ResultDisplay/   # 分析结果展示（含待办勾选）
│   │   ├── Settings/        # 设置面板（API Key、模型选择）
│   │   ├── SihuaCard/       # 四化能量卡片展示
│   │   └── TaskInput/       # 任务输入（简单模式 / 思考模式）
│   └── layout/          # 布局组件（Header, Footer, Layout）
├── constants/
│   ├── appConfig.ts     # 应用配置（API 地址、模型列表等）
│   ├── sihuaRules.ts    # 十天干四化规则表
│   └── starMeanings.ts  # 星曜含义释义
├── hooks/
│   ├── useAIAnalysis.ts     # AI 分析流程
│   ├── useConversation.ts   # 多轮对话状态管理
│   ├── useLocalStorage.ts   # 本地存储（API Key、历史、配置）
│   └── useSihua.ts          # 四化计算
├── pages/
│   ├── Home.tsx         # 首页（四化卡片 + 任务输入 + 结果展示）
│   ├── History.tsx      # 历史记录页
│   └── Settings.tsx     # 设置页
├── services/
│   ├── aiService.ts         # AI API 调用与错误处理
│   ├── conversationService.ts # 对话轮次管理
│   ├── sihuaService.ts      # 四化计算服务
│   └── storageService.ts    # 本地存储服务
├── types/
│   └── index.ts         # TypeScript 类型定义
└── utils/
    └── promptBuilder.ts # AI Prompt 构建器
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 配置 API Key

1. 启动应用后，点击导航栏「设置」
2. 填入 SiliconFlow 平台的 API Key
3. 可选择不同的 AI 模型（默认 DeepSeek V3.2）

## 📖 使用方式

1. **查看今日四化** — 首页顶部自动展示当日天干对应的四化星曜
2. **输入任务** — 在输入框描述你需要拆分的任务（至少 5 个字符）
3. **选择模式**
   - **简单模式** — 直接提交任务进行分析
   - **思考模式** — AI 会先通过多轮对话了解任务细节，再生成更精准的方案
4. **查看结果** — 从禄、权、科、忌四个维度查看分析，按行动步骤执行
5. **保存与回顾** — 可保存分析结果到历史记录，随时复用

## 🔮 四化维度说明

| 维度 | 含义 | 指引方向 |
|------|------|----------|
| 化禄 | 机遇、资源、收获 | 今日最有机遇的方向，适合从这里入手获取资源 |
| 化权 | 执行、决断、推动 | 今日执行力最强的方向，适合推动和决策 |
| 化科 | 计划、学习、系统化 | 今日最适合规划和系统化的方向 |
| 化忌 | 风险、阻碍、需注意 | 今日需要特别注意的风险点，要谨慎或避免 |

## 📜 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | TypeScript 编译 + Vite 构建 |
| `npm run lint` | ESLint 代码检查 |
| `npm run preview` | 预览生产构建 |

## License

Private
