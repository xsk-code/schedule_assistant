import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/Home';
import { HistoryPage } from './pages/History';
import { Loading } from './components/common/Loading';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { HistoryRecord } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'history'>('home');
  const [reuseTask, setReuseTask] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const {
    saveHistory,
    history,
    deleteHistory,
    clearAllHistory,
  } = useLocalStorage();

  const handleSaveHistory = (record: HistoryRecord) => {
    saveHistory(record);
  };

  const handleReuseTask = (task: string) => {
    setReuseTask(task);
    setCurrentPage('home');
  };

  return (
    <>
      {globalLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(44, 36, 32, 0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            backgroundColor: 'var(--color-bg)',
            borderRadius: 16,
            padding: 32,
            maxWidth: 280,
            width: 'calc(100% - 48px)',
            boxShadow: '0 8px 32px rgba(44, 36, 32, 0.15)',
          }}>
            <Loading message="AI 正在分析您的任务..." />
          </div>
        </div>
      )}
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'home' && (
          <HomePage
            onSaveHistory={handleSaveHistory}
            initialTask={reuseTask}
            onClearReuseTask={() => setReuseTask(null)}
            onLoadingChange={setGlobalLoading}
          />
        )}
        {currentPage === 'history' && (
          <HistoryPage
            history={history}
            onDelete={deleteHistory}
            onClearAll={clearAllHistory}
            onReuse={handleReuseTask}
          />
        )}
      </Layout>
    </>
  );
}

export default App;
