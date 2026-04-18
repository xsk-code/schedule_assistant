import { Card } from '../../common/Card';
import { Loading } from '../../common/Loading';
import type { SihuaInfo } from '../../../types';
import { SIHUA_DIMENSION_NAMES } from '../../../constants/sihuaRules';

interface SihuaCardProps {
  sihuaInfo: SihuaInfo | null;
  loading?: boolean;
  error?: string | null;
}

const DIMENSION_CONFIG = {
  lu: {
    gradient: 'from-emerald-50 to-emerald-100',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    label: 'bg-emerald-600',
    glyph: '禄',
    symbol: '◆',
  },
  quan: {
    gradient: 'from-amber-50 to-amber-100',
    border: 'border-amber-200',
    text: 'text-amber-700',
    label: 'bg-amber-600',
    glyph: '权',
    symbol: '◇',
  },
  ke: {
    gradient: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    text: 'text-blue-700',
    label: 'bg-blue-600',
    glyph: '科',
    symbol: '◆',
  },
  ji: {
    gradient: 'from-red-50 to-red-100',
    border: 'border-red-200',
    text: 'text-red-700',
    label: 'bg-red-600',
    glyph: '忌',
    symbol: '◇',
  },
};

export function SihuaCard({ sihuaInfo, loading = false, error = null }: SihuaCardProps) {
  if (loading) {
    return (
      <Card className="animate-fade-in">
        <div className="py-12 flex flex-col items-center gap-4">
          <Loading text="正在计算今日四化..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="animate-fade-in">
        <div className="py-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (!sihuaInfo) {
    return null;
  }

  const { sihua, solarDate, lunarDate, dayGanZhi } = sihuaInfo;

  return (
    <Card className="animate-slide-up overflow-hidden" padding="lg">
      <div className="relative">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-stone-100 to-stone-200 rounded-full opacity-50 blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-stone-500 mb-1">今日能量</p>
              <h2 className="text-display text-2xl font-bold text-stone-900 tracking-tight">
                四化态势
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-stone-600">{solarDate}</p>
              <p className="text-xs text-stone-400">{lunarDate}</p>
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-stone-600">
              <span className="text-sm">干支</span>
              <span className="font-medium text-stone-800">{dayGanZhi}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(['lu', 'quan', 'ke', 'ji'] as const).map((dimension, index) => {
              const config = DIMENSION_CONFIG[dimension];
              const star = sihua[dimension];
              const name = SIHUA_DIMENSION_NAMES[dimension];

              return (
                <div
                  key={dimension}
                  className={`
                    relative rounded-xl p-4 
                    bg-gradient-to-br ${config.gradient}
                    border ${config.border}
                    transition-all duration-300
                    hover:shadow-md hover:-translate-y-0.5
                    animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`${config.label} text-white text-xs font-medium px-2 py-0.5 rounded-full`}>
                      {config.symbol} {name}
                    </div>
                    <span className="text-stone-400 text-xs">{config.glyph}</span>
                  </div>
                  
                  <div className={`${config.text} text-2xl font-bold text-display tracking-wide`}>
                    {star}
                  </div>
                  
                  <div className="mt-2 h-1 rounded-full bg-white/60 overflow-hidden">
                    <div 
                      className={`h-full ${config.border.replace('border', 'bg')}`}
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}