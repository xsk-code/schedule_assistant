import { View, Image } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const Zap: React.FC<IconProps> = ({ size = 32, color = '#1C1917', className = '' }) => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  const encodedSvg = encodeURIComponent(svgContent);
  const base64Svg = `data:image/svg+xml,${encodedSvg}`;

  return (
    <View 
      className={`icon-zap ${className}`}
      style={{ width: `${size}rpx`, height: `${size}rpx`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Image 
        src={base64Svg} 
        style={{ width: `${size}rpx`, height: `${size}rpx` }} 
        mode="aspectFit"
      />
    </View>
  );
};

export default Zap;
