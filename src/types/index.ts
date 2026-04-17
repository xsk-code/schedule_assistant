export interface SihuaInfo {
  solarDate: string;
  lunarDate: string;
  dayGanZhi: string;
  dayGan: string;
  dayZhi: string;
  sihua: {
    lu: string;
    quan: string;
    ke: string;
    ji: string;
  };
}

export interface AnalysisResult {
  summary: string;
  bestEntry: {
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
  overallAdvice: string;
}

export interface DimensionAnalysis {
  star: string;
  analysis: string;
  actions: string[];
}

export interface JiDimensionAnalysis {
  star: string;
  analysis: string;
  warnings: string[];
  avoid: string[];
}

export interface ActionStep {
  step: number;
  title: string;
  description: string;
  dimension: 'lu' | 'quan' | 'ke' | 'ji';
  priority: '高' | '中' | '低';
  timeEstimate: string;
}

export interface HistoryRecord {
  id: string;
  task: string;
  createdAt: string;
  dateInfo: {
    solarDate: string;
    lunarDate: string;
    dayGan: string;
    dayZhi: string;
  };
  sihua: {
    lu: string;
    quan: string;
    ke: string;
    ji: string;
  };
  result: AnalysisResult;
}

export interface AppConfig {
  apiKey: string;
  apiKeyValid: boolean | null;
  theme: 'light' | 'dark';
  model: string;
}
