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
    <HistoryList
      history={history}
      onDelete={onDelete}
      onClearAll={onClearAll}
      onReuse={onReuse}
    />
  );
}
