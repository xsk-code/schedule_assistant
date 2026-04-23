import { View } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const XCircle: React.FC<IconProps> = ({ size = 32, color = 'currentColor', className = '' }) => {
  return (
    <View 
      className={`icon-x-circle ${className}`}
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
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    </View>
  );
};

export default XCircle;
