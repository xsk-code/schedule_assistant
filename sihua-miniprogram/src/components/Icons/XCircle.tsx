import { View, Image } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const XCircle: React.FC<IconProps> = ({ size = 32, color = '#C47A7A', className = '' }) => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;
  const encodedSvg = encodeURIComponent(svgContent);
  const base64Svg = `data:image/svg+xml,${encodedSvg}`;

  return (
    <View 
      className={`icon-x-circle ${className}`}
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

export default XCircle;
