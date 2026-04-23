import { View, Image } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const Brain: React.FC<IconProps> = ({ size = 32, color = '#1C1917', className = '' }) => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z"/></svg>`;
  const base64Svg = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;

  return (
    <View 
      className={`icon-brain ${className}`}
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

export default Brain;
