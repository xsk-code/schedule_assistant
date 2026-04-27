import type { SihuaInfo } from '../../../types';
import { SIHUA_DIMENSION_NAMES } from '../../../constants/sihuaRules';

interface SihuaBarProps {
  sihuaInfo: SihuaInfo | null;
}

const SihuaBar: React.FC<SihuaBarProps> = ({ sihuaInfo }) => {
  if (!sihuaInfo) {
    return (
      <div className="sihua-bar">
        <div className="sihua-bar-loading">
          <span style={{ color: 'var(--color-ink-4)', fontSize: '12px' }}>正在研读天机…</span>
        </div>
      </div>
    );
  }

  const { dayGanZhi, lunarDate, sihua } = sihuaInfo;

  return (
    <div className="sihua-bar">
      <div className="sihua-bar-date">
        <span className="sihua-bar-date-ganzhi">{dayGanZhi}</span>
        <span className="sihua-bar-date-lunar">{lunarDate}</span>
      </div>

      <div className="sihua-bar-items">
        <div className="sihua-item">
          <div className="sihua-item-dot sihua-item-dot--lu" />
          <span className="sihua-item-name sihua-item-name--lu">{sihua.lu}{SIHUA_DIMENSION_NAMES.lu}</span>
        </div>
        <div className="sihua-item">
          <div className="sihua-item-dot sihua-item-dot--quan" />
          <span className="sihua-item-name sihua-item-name--quan">{sihua.quan}{SIHUA_DIMENSION_NAMES.quan}</span>
        </div>
        <div className="sihua-item">
          <div className="sihua-item-dot sihua-item-dot--ke" />
          <span className="sihua-item-name sihua-item-name--ke">{sihua.ke}{SIHUA_DIMENSION_NAMES.ke}</span>
        </div>
        <div className="sihua-item">
          <div className="sihua-item-dot sihua-item-dot--ji" />
          <span className="sihua-item-name sihua-item-name--ji">{sihua.ji}{SIHUA_DIMENSION_NAMES.ji}</span>
        </div>
      </div>

      <div className="sihua-bar-divider" />
    </div>
  );
};

export { SihuaBar };
