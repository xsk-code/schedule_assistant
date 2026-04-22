import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/Home';
import { HistoryPage } from './pages/History';
import { SettingsPage } from './pages/Settings';
import { Loading } from './components/common/Loading';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { HistoryRecord } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'history' | 'settings'>('home');
  const [reuseTask, setReuseTask] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const { 
    apiKey, 
    saveApiKey, 
    removeApiKey, 
    saveHistory, 
    history, 
    deleteHistory, 
    clearAllHistory,
    config,
    updateConfig
  } = useLocalStorage();

  const handleSaveHistory = (record: HistoryRecord) => {
    saveHistory(record);
  };

  const handleReuseTask = (task: string) => {
    setReuseTask(task);
    setCurrentPage('home');
  };

  const handleSaveModel = (model: string) => {
    updateConfig({ model });
  };

  return (
    <>
      {globalLoading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-sm w-full mx-4 animate-scale-in">
            <Loading size="lg" text="AI 正在分析您的任务..." />
          </div>
        </div>
      )}
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'home' && (
          <HomePage
            apiKey={apiKey}
            model={config.model}
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
      {currentPage === 'settings' && (
        <SettingsPage
          apiKey={apiKey}
          model={config.model}
          onSaveApiKey={saveApiKey}
          onClearApiKey={removeApiKey}
          onSaveModel={handleSaveModel}
        />
      )}
    </Layout>
    </>
  );
}

export default App;
