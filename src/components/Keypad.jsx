const rows = [
    ["MC", "MR", "M+", "M-", "C"],
    ["sin(", "cos(", "tan(", "log(", "ln("],
    ["√(", "^", "x²", "π", "e"],
    ["7", "8", "9", "÷", "⌫"],
    ["4", "5", "6", "×", "%"],
    ["1", "2", "3", "−", "ANS"],
    ["0", ".", "(", ")", "="],
];

export default function Keypad({ onKey }) {
  return (
    <div className="keypad">
      {rows.map((r, i) => (
        <div className="row" key={i}>
          {r.map((k) => (
            <button
              key={k}
              className={
                "btn " +
                (k === "=" ? "equal " : "") +
                (["÷", "×", "−", "+", "^", "%"].includes(k) ? "op " : "") +
                (["C", "⌫"].includes(k) ? "danger " : "")
              }
              onClick={() => onKey(k)}
            >
              {k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}