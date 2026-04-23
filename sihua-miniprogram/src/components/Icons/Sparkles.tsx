import { View } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const Sparkles: React.FC<IconProps> = ({ size = 32, color = 'currentColor', className = '' }) => {
  return (
    <View 
      className={`icon-sparkles ${className}`}
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
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M9 3v1" />
        <path d="M3 5h4" />
        <path d="M3 9h1" />
      </svg>
    </View>
  );
};

export default Sparkles;
