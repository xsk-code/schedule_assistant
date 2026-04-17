import { SettingsPanel } from '../components/features/Settings/SettingsPanel';

interface SettingsPageProps {
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  onClearApiKey: () => void;
}

export function SettingsPage({ apiKey, onSaveApiKey, onClearApiKey }: SettingsPageProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">设置</h1>
      <SettingsPanel
        currentApiKey={apiKey}
        onSaveApiKey={onSaveApiKey}
        onClearApiKey={onClearApiKey}
      />
    </div>
  );
}
