import { useState, useEffect } from 'react';
import { getTodaySihua } from '../services/sihuaService';
import type { SihuaInfo } from '../types';

export function useSihua() {
  const [sihuaInfo, setSihuaInfo] = useState<SihuaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const info = getTodaySihua();
      setSihuaInfo(info);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : '获取四化信息失败');
      setLoading(false);
    }
  }, []);

  return {
    sihuaInfo,
    loading,
    error,
  };
}
