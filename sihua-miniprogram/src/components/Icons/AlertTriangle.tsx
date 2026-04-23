import { View, Image } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const AlertTriangle: React.FC<IconProps> = ({ size = 32, color = '#C47A7A', className = '' }) => {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
  const encodedSvg = encodeURIComponent(svgContent);
  const base64Svg = `data:image/svg+xml,${encodedSvg}`;

  return (
    <View 
      className={`icon-alert-triangle ${className}`}
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

export default AlertTriangle;
