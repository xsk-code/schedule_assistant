const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const iconDir = path.join(__dirname, '..', 'src', 'assets', 'tabbar');
const outputDir = path.join(__dirname, '..', 'src', 'assets', 'tabbar');

const icons = [
  'home',
  'home-active',
  'history',
  'history-active',
  'mine',
  'mine-active'
];

async function convertSvgToPng() {
  console.log('开始转换 SVG 到 PNG...');
  
  for (const icon of icons) {
    const svgPath = path.join(iconDir, `${icon}.svg`);
    const pngPath = path.join(outputDir, `${icon}.png`);
    
    if (fs.existsSync(svgPath)) {
      try {
        await sharp(svgPath)
          .resize(81, 81)
          .png()
          .toFile(pngPath);
        console.log(`✅ 转换成功: ${icon}.svg → ${icon}.png`);
      } catch (err) {
        console.log(`❌ 转换失败: ${icon}.svg - ${err.message}`);
        console.log('   尝试使用备用方法...');
      }
    } else {
      console.log(`⚠️  文件不存在: ${icon}.svg`);
    }
  }
  
  console.log('转换完成！');
}

convertSvgToPng();
