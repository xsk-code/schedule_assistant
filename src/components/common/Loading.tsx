interface LoadingProps {
  message?: string;
}

export function Loading({ message = '正在研读天机…' }: LoadingProps) {
  return (
    <div className="loading">
      <div className="loading-dots">
        <div className="loading-dot loading-dot--1" />
        <div className="loading-dot loading-dot--2" />
        <div className="loading-dot loading-dot--3" />
      </div>
      <span className="loading-text">{message}</span>
    </div>
  );
}
