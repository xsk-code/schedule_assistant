import { HistoryList } from '../components/features/HistoryList/HistoryList';
import type { HistoryRecord } from '../types';

interface HistoryPageProps {
  history: HistoryRecord[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onReuse: (task: string) => void;
}

export function HistoryPage({ history, onDelete, onClearAll, onReuse }: HistoryPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">历史记录</h1>
      <HistoryList
        history={history}
        onDelete={onDelete}
        onClearAll={onClearAll}
        onReuse={onReuse}
      />
    </div>
  );
}
