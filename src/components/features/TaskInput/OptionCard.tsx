interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  isOther?: boolean;
}

export function OptionCard({
  label,
  selected,
  onClick,
  disabled = false,
  isOther = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300
        ${selected
          ? 'border-stone-900 bg-stone-50 ring-4 ring-stone-900/10'
          : 'border-stone-200 bg-white hover:border-stone-400 hover:bg-stone-50/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-center gap-4">
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
            ${selected
              ? 'border-stone-900 bg-stone-900'
              : 'border-stone-300'
            }
          `}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
        <span className={`
          text-base font-medium
          ${selected ? 'text-stone-900' : 'text-stone-700'}
          ${isOther ? 'italic' : ''}
        `}>
          {label}
        </span>
      </div>
    </button>
  );
}
