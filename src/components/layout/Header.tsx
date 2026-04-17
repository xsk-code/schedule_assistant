interface HeaderProps {
  currentPage: 'home' | 'history' | 'settings';
  onNavigate: (page: 'home' | 'history' | 'settings') => void;
}

const NAV_ITEMS = [
  { id: 'home' as const, label: '首页', icon: '◆' },
  { id: 'history' as const, label: '历史', icon: '◇' },
  { id: 'settings' as const, label: '设置', icon: '◈' },
];

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white text-xl font-bold group-hover:bg-stone-800 transition-colors">
              四
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-stone-900 tracking-tight">四化节奏师</h1>
              <p className="text-xs text-stone-500 tracking-wider">SIHUA RHYTHM</p>
            </div>
          </button>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'text-stone-900 bg-stone-100'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="mr-1.5 opacity-60">{item.icon}</span>
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-stone-900 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}