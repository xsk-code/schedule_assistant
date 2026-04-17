interface Solar {
  getYear(): number;
  getMonth(): number;
  getDay(): number;
  getHour(): number;
  getMinute(): number;
  getSecond(): number;
  getWeek(): number;
  getWeekInChinese(): string;
  isLeapYear(): boolean;
  toYmd(): string;
  toYmdHms(): string;
  toString(): string;
  toFullString(): string;
  getLunar(): Lunar;
  next(days: number, onlyWorkday?: boolean): Solar;
}

interface Lunar {
  getYear(): number;
  getMonth(): number;
  getDay(): number;
  getHour(): number;
  getMinute(): number;
  getSecond(): number;
  getYearInChinese(): string;
  getMonthInChinese(): string;
  getDayInChinese(): string;
  getDayGan(): string;
  getDayZhi(): string;
  getDayInGanZhi(): string;
  getDayInGanZhiExact(): string;
  getDayInGanZhiExact2?(): string;
  getYearGan(): string;
  getYearZhi(): string;
  getYearInGanZhi(): string;
  getMonthGan(): string;
  getMonthZhi(): string;
  getMonthInGanZhi(): string;
  getTimeGan(): string;
  getTimeZhi(): string;
  getTimeInGanZhi(): string;
  getShengXiao(): string;
  getJieQi(): string;
  getJieQiList(): string[];
  getJieQiTable(): Record<string, Solar>;
}

interface SolarConstructor {
  fromYmd(year: number, month: number, day: number): Solar;
  fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): Solar;
  fromDate(date: Date): Solar;
  fromJulianDay(julianDay: number): Solar;
}

declare const Solar: SolarConstructor;
declare const Lunar: any;
