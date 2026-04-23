import { View, Image } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const Sparkles: React.FC<IconProps> = ({ size = 32, color = '#1C1917', className = '' }) => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v1"/><path d="M3 5h4"/><path d="M3 9h1"/></svg>`;
  const base64Svg = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`;

  return (
    <View 
      className={`icon-sparkles ${className}`}
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

export default Sparkles;
