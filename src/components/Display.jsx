export default function Display({ expression, result }) {
  return (
    <div className="display">
      <div className="expr">{expression || "0"}</div>
      <div className="result">{result}</div>
    </div>
  );
}