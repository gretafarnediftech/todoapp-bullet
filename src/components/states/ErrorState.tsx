interface ErrorStateProps {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="bj-state">
      <div className="bj-state-mark bj-write" style={{ transform: 'rotate(-8deg)' }}>!</div>
      <div className="bj-state-h">Couldn't load the page.</div>
      <p className="bj-state-p">Something on our side. The page is fine — it's the fetch that failed.</p>
      <button className="bj-btn-primary" onClick={onRetry}>Try again</button>
    </div>
  )
}
