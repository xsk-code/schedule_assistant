import { Solar } from 'lunar-javascript';
import { SIHUA_RULES } from '@/constants/sihuaRules';
import type { SihuaInfo } from '@/types';

export function calculateSihua(year: number, month: number, day: number): SihuaInfo {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();
  
  let dayGanZhi: string;
  try {
    dayGanZhi = (lunar as any).getDayInGanZhiExact2 
      ? (lunar as any).getDayInGanZhiExact2() 
      : lunar.getDayInGanZhiExact();
  } catch {
    dayGanZhi = lunar.getDayInGanZhiExact();
  }
  
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

export function formatDateDisplay(sihuaInfo: SihuaInfo): { date: string; lunar: string } {
  const date = new Date(sihuaInfo.solarDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekDay = weekDays[date.getDay()];
  
  return {
    date: `${month}月${day}日 ${weekDay}`,
    lunar: `${sihuaInfo.dayGanZhi}日`
  };
}
