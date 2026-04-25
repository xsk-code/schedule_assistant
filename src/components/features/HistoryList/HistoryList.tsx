import { useState } from 'react';
import { Empty } from '../../common/Empty';
import { ResultCard } from '../ResultDisplay/ResultCard';
import type { HistoryRecord } from '../../../types';

interface HistoryListProps {
  history: HistoryRecord[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onReuse: (task: string) => void;
}

function SihuaTag({ label, star }: { label: string; star: string }) {
  const labels: Record<string, string> = {
    lu: '禄',
    quan: '权',
    ke: '科',
    ji: '忌',
  };

  return (
    <div className="history-sihua-tag">
      <div className={`history-sihua-tag-dot history-sihua-tag-dot--${label}`} />
      <span className={`history-sihua-tag-label history-sihua-tag-label--${label}`}>
        {labels[label]}
      </span>
      <span className="history-sihua-tag-star">{star}</span>
    </div>
  );
}

function HistoryDetail({
  record,
  onBack,
  onDelete,
  onReuse,
}: {
  record: HistoryRecord;
  onBack: () => void;
  onDelete: (id: string) => void;
  onReuse: (task: string) => void;
}) {
  const toggleStep = (_index: number) => {
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  return (
    <div>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-ink-2)',
            fontSize: 14,
            fontFamily: '"PingFang SC", sans-serif',
            padding: '4px 0',
          }}
        >
          ← 返回
        </button>
        <span style={{
          flex: 1,
          textAlign: 'center',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--color-ink-1)',
          fontFamily: '"Noto Serif SC", Georgia, serif',
        }}>
          深度解析
        </span>
        <button
          onClick={() => onDelete(record.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-ji)',
            fontSize: 13,
            fontFamily: '"PingFang SC", sans-serif',
            padding: '4px 0',
          }}
        >
          删除
        </button>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: 'var(--color-ink-4)', fontFamily: '"Noto Serif SC", Georgia, serif', display: 'block', marginBottom: 4 }}>
            原始任务
          </span>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-ink-1)', lineHeight: 1.5, fontFamily: '"PingFang SC", sans-serif' }}>
            {record.task}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--color-ink-4)', fontFamily: '"Noto Serif SC", Georgia, serif' }}>
            {formatDate(record.createdAt)}
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
            {(['lu', 'quan', 'ke', 'ji'] as const).map((dim) => (
              <SihuaTag key={dim} label={dim} star={record.sihua[dim]} />
            ))}
          </div>
        </div>
      </div>

      <ResultCard
        result={record.result}
        onToggleStep={toggleStep}
        showActions={true}
      />

      <div style={{ padding: '0 20px', marginTop: 20 }}>
        <div className="home-actions">
          <button
            className="btn-secondary btn-secondary--primary"
            onClick={() => onReuse(record.task)}
          >
            重新分析
          </button>
          <button className="btn-secondary" onClick={onBack}>
            返回列表
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 20px', marginTop: 20 }}>
        <span style={{ fontSize: 11, color: 'var(--color-ink-4)', fontFamily: '"Noto Serif SC", Georgia, serif' }}>
          基于四化能量理论
        </span>
      </div>
    </div>
  );
}

export function HistoryList({ history, onDelete, onClearAll, onReuse }: HistoryListProps) {
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}月${day}日 ${hours}:${minutes}`;
  };

  const confirmClearAll = () => {
    onClearAll();
    setClearConfirm(false);
    setSelectedRecord(null);
  };

  if (selectedRecord) {
    return (
      <HistoryDetail
        record={selectedRecord}
        onBack={() => setSelectedRecord(null)}
        onDelete={(id) => {
          onDelete(id);
          setSelectedRecord(null);
        }}
        onReuse={(task) => {
          onReuse(task);
          setSelectedRecord(null);
        }}
      />
    );
  }

  if (history.length === 0) {
    return (
      <div style={{ padding: '40px 20px' }}>
        <Empty
          title="暂无案卷"
          description="您的任务分析记录将显示在这里"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="history-header">
        <div className="history-header-left">
          <span className="history-title">案卷</span>
          <span className="history-count">共 {history.length} 条</span>
        </div>
        {history.length > 0 && (
          <div>
            {clearConfirm ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--color-ji)' }}>确认清空？</span>
                <button className="history-clear" onClick={confirmClearAll}>确认</button>
                <button className="history-clear" onClick={() => setClearConfirm(false)} style={{ color: 'var(--color-ink-4)' }}>取消</button>
              </div>
            ) : (
              <button className="history-clear" onClick={() => setClearConfirm(true)}>
                清空
              </button>
            )}
          </div>
        )}
      </div>

      <div className="history-list">
        {history.map((record) => (
          <div
            key={record.id}
            className="history-item"
            onClick={() => setSelectedRecord(record)}
          >
            <div className="history-item-header">
              <span className="history-item-task">{record.task}</span>
              <button
                className="history-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(record.id);
                }}
              >
                <span style={{ fontSize: 16, color: 'var(--color-ink-4)', lineHeight: 1 }}>×</span>
              </button>
            </div>

            <div className="history-item-meta">
              <span className="history-item-date">
                {formatDate(record.createdAt)}
              </span>
              <span className="history-item-ganzhi">
                {record.dateInfo.dayGan}{record.dateInfo.dayZhi}日
              </span>
            </div>

            <div className="history-item-sihua">
              <SihuaTag label="lu" star={record.sihua.lu} />
              <SihuaTag label="quan" star={record.sihua.quan} />
              <SihuaTag label="ke" star={record.sihua.ke} />
              <SihuaTag label="ji" star={record.sihua.ji} />
            </div>

            <div className="history-item-summary">
              <span className="history-item-summary-label">今日待办</span>
              <span className="history-item-summary-text">
                {record.result.summary}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
