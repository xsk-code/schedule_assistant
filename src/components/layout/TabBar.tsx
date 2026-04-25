interface TabBarProps {
  currentPage: 'home' | 'history';
  onNavigate: (page: 'home' | 'history') => void;
}

const TAB_ITEMS = [
  { id: 'home' as const, label: '开卷', icon: HomeIcon },
  { id: 'history' as const, label: '案卷', icon: HistoryIcon },
];

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-vermilion)' : 'var(--color-ink-4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function HistoryIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-vermilion)' : 'var(--color-ink-4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function TabBar({ currentPage, onNavigate }: TabBarProps) {
  return (
    <nav className="tab-bar">
      {TAB_ITEMS.map((item) => {
        const isActive = currentPage === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="tab-bar-item"
          >
            <Icon active={isActive} />
            <span
              className="tab-bar-label"
              style={{ color: isActive ? 'var(--color-vermilion)' : 'var(--color-ink-4)' }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
