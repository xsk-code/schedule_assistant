import { View } from '@tarojs/components';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const AlertTriangle: React.FC<IconProps> = ({ size = 32, color = 'currentColor', className = '' }) => {
  return (
    <View 
      className={`icon-alert-triangle ${className}`}
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
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    </View>
  );
};

export default AlertTriangle;
