declare module 'lunar-javascript' {
  export class Solar {
    constructor(year: number, month: number, day: number);
    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    toString(): string;
    toYmd(): string;
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromDate(date: Date): Solar;
  }

  export class Lunar {
    constructor(year: number, month: number, day: number);
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearGanZhi(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGanZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGanZhi(): string;
    getDayInGanZhiExact(): string;
    getDayInGanZhiExact2(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeZhi(): string;
    getTimeGan(): string;
    getTimeGanZhi(): string;
    getSolar(): Solar;
    toString(): string;
    toYmd(): string;
    static fromYmd(year: number, month: number, day: number): Lunar;
    static fromDate(date: Date): Lunar;
  }

  export class Yun {
    constructor(lunar: Lunar, gender: number);
    getStartYear(): number;
    getStartMonth(): number;
    getStartDay(): number;
    getStartSolar(): Solar;
    getAge(): number;
    getGender(): number;
    getLunar(): Lunar;
    getDaYun(): DaYun[];
  }

  export class DaYun {
    constructor(yun: Yun, index: number, startYear: number, endYear: number);
    getIndex(): number;
    getStartYear(): number;
    getEndYear(): number;
    getStartAge(): number;
    getEndAge(): number;
    getYearGanZhi(): string;
    getLiuNian(): LiuNian[];
  }

  export class LiuNian {
    constructor(daYun: DaYun, index: number);
    getIndex(): number;
    getYear(): number;
    getYearGanZhi(): string;
    getYearZhi(): string;
    getLiuYue(): LiuYue[];
  }

  export class LiuYue {
    constructor(liuNian: LiuNian, index: number);
    getIndex(): number;
    getMonthInChinese(): string;
    getMonthGanZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
  }

  export class EightChar {
    constructor(year: number, month: number, day: number, hour: number);
    constructor(lunar: Lunar, timeZhi?: string);
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getShengXiao(): string;
    getXun(): string;
    getXunKong(): string[];
    getYun(gender: number): Yun;
    toString(): string;
  }

  export class ZiWei {
    constructor(lunar: Lunar);
    getLunar(): Lunar;
    getPan(): Pan;
  }

  export class Pan {
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getLunarYear(): number;
    getLunarMonth(): number;
    getLunarDay(): number;
    getShengXiao(): string;
    getYearGanZhi(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGanZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGanZhi(): string;
    getDayInGanZhiExact(): string;
    getDayInGanZhiExact2(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGanZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getZhiXing(zhi: string): Star;
    getGong(zhi: string): Gong;
    getMingGong(): Gong;
    getShenGong(): Gong;
    getGongs(): Gong[];
  }

  export class Gong {
    getName(): string;
    getZhi(): string;
    getZhiXing(): Star;
    getMainStars(): Star[];
    getMinorStars(): Star[];
    getHua(): string;
    getLuck(): string;
    getYearLuck(): string;
    getAgeLuck(): string;
  }

  export class Star {
    getName(): string;
    getType(): string;
    getHua(): string;
    getPosition(): string;
  }

  export class Holiday {
    static getHoliday(year: number, month: number, day: number): string;
    static getHolidays(year: number, month: number): { [key: string]: string };
  }

  export class JieQi {
    static getJieQi(year: number, month: number, day: number): string;
    static getJieQiTime(year: number, month: number, day: number): { name: string; time: Date };
  }
}
