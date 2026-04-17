import { SIHUA_RULES } from '../constants/sihuaRules';
import type { SihuaInfo } from '../types';

export function calculateSihua(year: number, month: number, day: number): SihuaInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  
  const dayGanZhi = lunar.getDayInGanZhiExact2 
    ? lunar.getDayInGanZhiExact2() 
    : lunar.getDayInGanZhiExact();
  
  const dayGan = dayGanZhi.charAt(0);
  const dayZhi = dayGanZhi.substring(1);
  
  const sihua = SIHUA_RULES[dayGan];
  
  if (!sihua) {
    throw new Error(`未找到天干 ${dayGan} 对应的四化规则`);
  }
  
  return {
    solarDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    lunarDate: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    dayGanZhi,
    dayGan,
    dayZhi,
    sihua: {
      lu: sihua.lu,
      quan: sihua.quan,
      ke: sihua.ke,
      ji: sihua.ji,
    },
  };
}

export function getTodaySihua(): SihuaInfo {
  const now = new Date();
  return calculateSihua(now.getFullYear(), now.getMonth() + 1, now.getDate());
}
