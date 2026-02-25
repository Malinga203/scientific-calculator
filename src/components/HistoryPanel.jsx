export default function HistoryPanel({ history, onUse, onClear }) {
  return (
    <div className="history">
      <div className="history-header">
        <h3>History</h3>
        <button className="btn small" onClick={onClear}>Clear</button>
      </div>

      {history.length === 0 ? (
        <p className="muted">No history yet</p>
      ) : (
        <ul className="history-list">
          {history.map((item, idx) => (
            <li key={idx} className="history-item">
              <button className="history-use" onClick={() => onUse(item.result)}>
                {item.expr} = <b>{item.result}</b>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}