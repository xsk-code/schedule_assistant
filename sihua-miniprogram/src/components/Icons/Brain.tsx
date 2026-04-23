import { View } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const Brain: React.FC<IconProps> = ({ size = 32, color = 'currentColor', className = '' }) => {
  return (
    <View 
      className={`icon-brain ${className}`}
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
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54Z" />
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54Z" />
      </svg>
    </View>
  );
};

export default Brain;
