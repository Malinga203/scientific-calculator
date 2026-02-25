import {useEffect,useMemo,useState} from "react";
import Display from "./display";
import Keypad from "./Keypad";
import HistoryPanel from "./HistoryPanel";
import math from "../utils/mathEngine";

const LS_HISTORY = "calc_history_v1";
const LS_THEME = "calc_theme_v1";
const LS_MEMORY = "calc_memory_v1";

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState("dark"); 
  const [memory, setMemory] = useState(0);

  //Load saved data
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem(LS_HISTORY) || "[]");
    const savedTheme = localStorage.getItem(LS_THEME) || "dark";
    const savedMemory = Number(localStorage.getItem(LS_MEMORY) || "0");

    setHistory(savedHistory);
    setTheme(savedTheme);
    setMemory(savedMemory);
  }, []);

  //Save theme
  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem(LS_THEME, theme);
  }, [theme]);

  //Save history & memory
  useEffect(() => {
    localStorage.setItem(LS_HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(LS_MEMORY, String(memory));
  }, [memory]);

  const canPreview = useMemo(() => {
    return /[0-9)]/.test(expression);
  }, [expression]);

  //Preview result while typing
  useEffect(() => {
    if (!canPreview) {
      setResult("0");
      return;
    }
    try {
      const cleaned = toMathExpression(expression);
      const r = math.evaluate(cleaned);
      setResult(formatNumber(r));
    } catch {
      
    }
  }, [expression, canPreview]);

  //Keyboard support
  useEffect(() => {
    const handler = (e) => {
      const k = e.key;

      if((k >= "0" && k <= "9") || k === "." || k === "(" || k === ")") {
        setExpression((p) => p + k);
        return;
      }

      if(k === "+" || k === "-" || k === "*" || k === "/" || k === "%") {
        const map = { "*": "×", "/": "÷", "-": "−" };
        setExpression((p) => p + (map[k] || k));
        return;
      }

      if(k === "Enter") {
        e.preventDefault();
        handleEquals();
        return;
      }

      if(k === "Backspace") {
        handleDelete();
        return;
      }

      if(k === "Escape") {
        handleClear();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);

  }, [expression]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const addHistory = (expr, res) => {
    const newItem = { expr, result: res, time: Date.now() };
    setHistory((prev) => [newItem, ...prev].slice(0, 30));
  };

  const handleClearHistory = () => setHistory([]);

  const handleClear = () => {
    setExpression("");
    setResult("0");
  };

  const handleDelete = () => {
    setExpression((p) => p.slice(0, -1));
  };

  const handleSquare = () => {
    if (!expression) return;
    setExpression((p) => '(${p})^2');
  };

  const handleEquals = () => {
    if (!expression) return;
    try {
      const cleaned = toMathExpression(expression);
      const r = math.evaluate(cleaned);
      const formatted = formatNumber(r);
      setResult(formatted);
      addHistory(expression, formatted);
      setExpression(String(formatted));
    } catch {
      setResult("Error");
    }
  };

  // Memory functions
  const handleMemory = (type) => {
    const current = Number(result);
    if (Number.isNaN(current)) return;

    if (type === "MC") setMemory(0);
    if (type === "MR") setExpression((p) => p + String(memory));
    if (type === "M+") setMemory((m) => m + current);
    if (type === "M-") setMemory((m) => m - current);
  };

  const handleKey = (key) => {
    // memory
    if (["MC", "MR", "M+", "M-"].includes(key)) {
      handleMemory(key);
      return;
    }

    if (key === "C") {
      handleClear();
      return;
    }

    if (key === "⌫") {
      handleDelete();
      return;
    }

    if (key === "ANS") {
 
    if (result && result !== "Error") {
    setExpression((p) => p + String(result));
  }
  return;
}
    if (key === "x²") {
      handleSquare();
      return;
    }

    if (key === "=") {
      handleEquals();
      return;
    }

    // constants
    if (key === "π") {
      setExpression((p) => p + "pi");
      return;
    }
    if (key === "e") {
      setExpression((p) => p + "e");
      return;
    }

    // operators mapping
    const map = { "÷": "/", "×": "*", "−": "-" };
    const finalKey = map[key] || key;

    setExpression((p) => p + finalKey);
  };

  const useHistoryValue = (val) => {
    setExpression(String(val));
  };

  return (
    <div className="app">
      <div className="topbar">
        <div>
          <h1 className="title">Modern Scientific Calculator</h1>
          <p className="subtitle">React + mathjs (Degrees)</p>
        </div>
        <div className="right">
          <div className="memory">Memory: <b>{memory}</b></div>
          <button className="btn small" onClick={toggleTheme}>
            {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
        </div>
      </div>

      <div className="layout">
        <div className="card">
          <Display expression={prettyExpression(expression)} result={result} />
          <Keypad onKey={handleKey} />
          <p className="hint">
            Keyboard: 0-9, + - * /, Enter (=), Backspace, Esc (clear)
          </p>
        </div>

        <HistoryPanel
          history={history}
          onUse={useHistoryValue}
          onClear={handleClearHistory}
        />
      </div>
    </div>
  );
}

// Convert symbols to mathjs-friendly expression
function toMathExpression(expr) {
  return expr
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("−", "-");
}

// For better UI display (optional)
function prettyExpression(expr) {
  return expr
    .replaceAll("*", " × ")
    .replaceAll("/", " ÷ ")
    .replaceAll("-", " − ")
    .replaceAll("+", " + ");
}

function formatNumber(n) {
  if (typeof n !== "number") return String(n);
  if (!Number.isFinite(n)) return "Error";
  // limit long decimals
  return Number(n.toFixed(10)).toString();
}