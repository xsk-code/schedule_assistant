import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';

export function useStatusBarHeight() {
  const [statusBarHeight, setStatusBarHeight] = useState(0);

  useEffect(() => {
    const systemInfo = Taro.getSystemInfoSync();
    setStatusBarHeight(systemInfo.statusBarHeight || 0);
  }, []);

  return statusBarHeight;
}
