import { SettingsPanel } from '../components/features/Settings/SettingsPanel';

interface SettingsPageProps {
  apiKey: string;
  model: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
  onSaveModel: (model: string) => void;
  historyCount?: number;
  onClearHistory?: () => void;
}

export function SettingsPage({ apiKey, model, onSaveApiKey, onClearApiKey, onSaveModel, historyCount, onClearHistory }: SettingsPageProps) {
  return (
    <SettingsPanel
      currentApiKey={apiKey}
      currentModel={model}
      onSaveApiKey={onSaveApiKey}
      onClearApiKey={onClearApiKey}
      onSaveModel={onSaveModel}
      historyCount={historyCount}
      onClearHistory={onClearHistory}
    />
  );
}
