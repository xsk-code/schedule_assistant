import { SettingsPanel } from '../components/features/Settings/SettingsPanel';

interface SettingsPageProps {
  apiKey: string;
  model: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
  onSaveModel: (model: string) => void;
}

export function SettingsPage({ apiKey, model, onSaveApiKey, onClearApiKey, onSaveModel }: SettingsPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">设置</h1>
      <SettingsPanel
        currentApiKey={apiKey}
        currentModel={model}
        onSaveApiKey={onSaveApiKey}
        onClearApiKey={onClearApiKey}
        onSaveModel={onSaveModel}
      />
    </div>
  );
}
