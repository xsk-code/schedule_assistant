import { Card } from '../../common/Card';
import { Loading } from '../../common/Loading';
import type { SihuaInfo } from '../../../types';
import { SIHUA_DIMENSION_NAMES } from '../../../constants/sihuaRules';

interface SihuaCardProps {
  sihuaInfo: SihuaInfo | null;
  loading?: boolean;
  error?: string | null;
}

const DIMENSION_COLORS = {
  lu: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'bg-emerald-500' },
  quan: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'bg-amber-500' },
  ke: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'bg-blue-500' },
  ji: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'bg-red-500' },
};

export function SihuaCard({ sihuaInfo, loading = false, error = null }: SihuaCardProps) {
  if (loading) {
    return (
      <Card>
        <Loading text="正在计算今日四化..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
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
    <Card className="w-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📅</span>
        今日四化能量
      </h2>

      <div className="text-center mb-6 text-gray-600">
        <p className="text-base">
          <span className="font-medium">公历：</span>{solarDate}
          <span className="mx-2">·</span>
          <span className="font-medium">农历：</span>{lunarDate}
        </p>
        <p className="text-sm mt-1">
          <span className="font-medium">干支：</span>{dayGanZhi}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['lu', 'quan', 'ke', 'ji'] as const).map((dimension) => {
          const colors = DIMENSION_COLORS[dimension];
          const star = sihua[dimension];
          const name = SIHUA_DIMENSION_NAMES[dimension];

          return (
            <div
              key={dimension}
              className={`${colors.bg} ${colors.border} border rounded-lg p-4 text-center transition-transform hover:scale-105`}
            >
              <div className={`inline-block ${colors.label} text-white text-xs font-medium px-2 py-0.5 rounded-full mb-2`}>
                {name}
              </div>
              <div className={`${colors.text} text-xl font-bold`}>
                {star}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
