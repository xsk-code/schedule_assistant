import { useState } from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { ResultDisplay } from '../ResultDisplay/ResultDisplay';
import type { HistoryRecord } from '../../../types';
import { SIHUA_DIMENSION_NAMES } from '../../../constants/sihuaRules';

interface HistoryListProps {
  history: HistoryRecord[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onReuse: (task: string) => void;
}

const DIMENSION_COLORS = {
  lu: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'bg-emerald-500' },
  quan: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'bg-amber-500' },
  ke: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: 'bg-blue-500' },
  ji: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'bg-red-500' },
};

export function HistoryList({ history, onDelete, onClearAll, onReuse }: HistoryListProps) {
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = (id: string) => {
    onDelete(id);
    setDeleteConfirmId(null);
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
    }
  };

  const confirmClearAll = () => {
    onClearAll();
    setClearConfirm(false);
    setSelectedRecord(null);
  };

  const handleViewDetail = (record: HistoryRecord) => {
    setSelectedRecord(record);
  };

  const handleReuse = (record: HistoryRecord) => {
    onReuse(record.task);
    setSelectedRecord(null);
  };

  if (history.length === 0) {
    return (
      <Card className="w-full">
        <div className="text-center py-12">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-600 text-lg mb-2">暂无历史记录</p>
          <p className="text-gray-400 text-sm">分析任务后，记录会自动保存到这里</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {selectedRecord ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={() => setSelectedRecord(null)}>
              ← 返回列表
            </Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleReuse(selectedRecord)}>
                🔄 重新分析
              </Button>
              <Button variant="danger" onClick={() => confirmDelete(selectedRecord.id)}>
                🗑️ 删除
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              <span>📅 {formatDate(selectedRecord.createdAt)}</span>
              <span>🌙 {selectedRecord.dateInfo.lunarDate}</span>
              <span>📜 {selectedRecord.dateInfo.dayGan}日</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {(['lu', 'quan', 'ke', 'ji'] as const).map((dim) => {
                const colors = DIMENSION_COLORS[dim];
                const star = selectedRecord.sihua[dim];
                const name = SIHUA_DIMENSION_NAMES[dim];
                return (
                  <span
                    key={dim}
                    className={`${colors.bg} ${colors.border} border ${colors.text} text-xs px-2 py-1 rounded-full`}
                  >
                    {name}: {star}
                  </span>
                );
              })}
            </div>
            <p className="text-gray-800 font-medium">
              任务：{selectedRecord.task}
            </p>
          </div>

          <ResultDisplay
            result={selectedRecord.result}
            onCopy={() => {
              const text = JSON.stringify(selectedRecord.result, null, 2);
              navigator.clipboard.writeText(text).then(() => {
                alert('已复制到剪贴板');
              }).catch(() => {
                alert('复制失败，请手动复制');
              });
            }}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              历史记录 ({history.length}/50)
            </h2>
            {clearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600">确认清空？</span>
                <Button variant="danger" size="sm" onClick={confirmClearAll}>
                  确认
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setClearConfirm(false)}>
                  取消
                </Button>
              </div>
            ) : (
              <Button variant="danger" size="sm" onClick={() => setClearConfirm(true)}>
                清空全部
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {history.map((record) => (
              <Card key={record.id} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                      <span>📅 {formatDate(record.createdAt)}</span>
                      <span>🌙 {record.dateInfo.lunarDate}</span>
                    </div>
                    <p className="text-gray-800 font-medium mb-2 line-clamp-2">
                      {record.task}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(['lu', 'quan', 'ke', 'ji'] as const).map((dim) => {
                        const colors = DIMENSION_COLORS[dim];
                        const star = record.sihua[dim];
                        const name = SIHUA_DIMENSION_NAMES[dim];
                        return (
                          <span
                            key={dim}
                            className={`${colors.bg} ${colors.border} border ${colors.text} text-xs px-2 py-0.5 rounded-full`}
                          >
                            {name}: {star}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleViewDetail(record)}
                    >
                      查看详情
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReuse(record)}
                    >
                      重新分析
                    </Button>
                    {deleteConfirmId === record.id ? (
                      <div className="flex gap-1">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => confirmDelete(record.id)}
                        >
                          确认
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          取消
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
