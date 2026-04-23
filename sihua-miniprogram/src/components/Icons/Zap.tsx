import { View } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const Zap: React.FC<IconProps> = ({ size = 32, color = 'currentColor', className = '' }) => {
  return (
    <View 
      className={`icon-zap ${className}`}
      style={{ width: `${size}rpx`, height: `${size}rpx` }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    </View>
  );
};

export default Zap;
