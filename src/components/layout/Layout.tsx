import { TabBar } from './TabBar';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'history';
  onNavigate: (page: 'home' | 'history') => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {children}
      </main>
      <TabBar currentPage={currentPage} onNavigate={onNavigate} />
    </div>
  );
}
