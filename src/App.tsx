import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/Home';
import { HistoryPage } from './pages/History';
import { SettingsPage } from './pages/Settings';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { HistoryRecord } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'history' | 'settings'>('home');
  const [reuseTask, setReuseTask] = useState<string | null>(null);
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
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === 'home' && (
        <HomePage
          apiKey={apiKey}
          model={config.model}
          onSaveHistory={handleSaveHistory}
          initialTask={reuseTask}
          onClearReuseTask={() => setReuseTask(null)}
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
  );
}

export default App;
