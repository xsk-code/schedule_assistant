#!/usr/bin/env node

const path = require('path');
const { Solar } = require(path.join(__dirname, '..', 'vendor', 'lunar.js'));

const SIHUA = {
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

function usage() {
  console.error('Usage: node scripts/get_day_tiangan.js YYYY-MM-DD');
  process.exit(1);
}

const input = process.argv[2];
if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(input)) {
  usage();
}

const [year, month, day] = input.split('-').map(Number);
const solar = Solar.fromYmd(year, month, day);
const lunar = solar.getLunar();
const dayGanZhi = lunar.getDayInGanZhiExact2 ? lunar.getDayInGanZhiExact2() : lunar.getDayInGanZhiExact();
const dayGan = dayGanZhi.charAt(0);
const dayZhi = dayGanZhi.substring(1);
const sihua = SIHUA[dayGan];

if (!sihua) {
  console.error(`No sihua mapping for day gan: ${dayGan}`);
  process.exit(2);
}

console.log(JSON.stringify({
  date: input,
  day_ganzhi: dayGanZhi,
  day_gan: dayGan,
  day_zhi: dayZhi,
  sihua,
}, null, 2));
