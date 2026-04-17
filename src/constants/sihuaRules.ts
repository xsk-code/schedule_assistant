export const SIHUA_RULES: Record<string, {
  lu: string;
  quan: string;
  ke: string;
  ji: string;
}> = {
  '甲': { lu: '廉贞', quan: '破军', ke: '武曲', ji: '太阳' },
  '乙': { lu: '天机', quan: '天梁', ke: '紫微', ji: '太阴' },
  '丙': { lu: '天同', quan: '天机', ke: '文昌', ji: '廉贞' },
  '丁': { lu: '太阴', quan: '天同', ke: '天机', ji: '巨门' },
  '戊': { lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机' },
  '己': { lu: '武曲', quan: '贪狼', ke: '天梁', ji: '文曲' },
  '庚': { lu: '太阳', quan: '武曲', ke: '太阴', ji: '天同' },
  '辛': { lu: '巨门', quan: '太阳', ke: '文曲', ji: '文昌' },
  '壬': { lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲' },
  '癸': { lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼' },
};

export const SIHUA_DIMENSION_MEANINGS = {
  lu: '机遇、资源、收获',
  quan: '执行、决断、推动',
  ke: '计划、学习、系统化',
  ji: '风险、阻碍、需要注意',
};

export const SIHUA_DIMENSION_NAMES = {
  lu: '禄',
  quan: '权',
  ke: '科',
  ji: '忌',
};
