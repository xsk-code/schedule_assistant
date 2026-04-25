interface EmptyProps {
  title?: string;
  description?: string;
}

export function Empty({
  title = '落笔写下所虑',
  description = '四化能量将为你指引方向',
}: EmptyProps) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <div className="empty-mountain">
          <div className="empty-mountain-row">
            <div className="empty-mountain-dot--tiny" />
            <div className="empty-mountain-dot--tiny" />
            <div className="empty-mountain-dot--tiny" />
            <div className="empty-mountain-dot--small" />
            <div className="empty-mountain-dot" />
            <div className="empty-mountain-dot--small" />
            <div className="empty-mountain-dot--tiny" />
            <div className="empty-mountain-dot--tiny" />
            <div className="empty-mountain-dot--tiny" />
          </div>
          <div className="empty-mountain-row">
            <div className="empty-mountain-dot--tiny" />
            <div className="empty-mountain-dot--tiny" />
            <div className="empty-mountain-dot--small" />
            <div className="empty-mountain-dot" />
            <div className="empty-mountain-dot--small" />
            <div className="empty-mountain-dot--tiny" />
            <div className="empty-mountain-dot--tiny" />
          </div>
          <div className="empty-mountain-row">
            <div className="empty-mountain-dot--tiny" />
            <div className="empty-mountain-dot--small" />
            <div className="empty-mountain-dot" />
            <div className="empty-mountain-dot--small" />
            <div className="empty-mountain-dot--tiny" />
          </div>
        </div>
      </div>
      <span className="empty-title">{title}</span>
      {description && (
        <span className="empty-description">{description}</span>
      )}
    </div>
  );
}
