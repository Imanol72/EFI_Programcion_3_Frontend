// src/components/NiceSelect.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

export default function NiceSelect({
  value,
  onChange,
  options = [],
  placeholder = "Seleccionar…",
  className = "",
  disabled = false,
  name,
}) {
  const [open, setOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const rootRef = useRef(null);

  const idxByValue = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value]
  );
  const selectedLabel = idxByValue >= 0 ? options[idxByValue].label : "";

  // Cerrar al clickear afuera
  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Keyboard
  const onKeyDown = (e) => {
    if (disabled) return;
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      setHoverIdx(Math.max(0, idxByValue));
      return;
    }
    if (open) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHoverIdx((i) => Math.min(options.length - 1, (i < 0 ? 0 : i + 1)));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHoverIdx((i) => Math.max(0, (i < 0 ? 0 : i - 1)));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const opt = options[hoverIdx];
        if (opt) {
          onChange?.({ target: { name, value: opt.value } }, opt);
          setOpen(false);
        }
      }
    }
  };

  const selectOption = (opt, i) => {
    onChange?.({ target: { name, value: opt.value } }, opt);
    setHoverIdx(i);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`nsel ${className}`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-disabled={disabled}
      role="combobox"
    >
      {/* “input” visual */}
      <div
        className={`nsel-control ${disabled ? "is-disabled" : ""}`}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <div className={`nsel-value ${selectedLabel ? "" : "placeholder"}`}>
          {selectedLabel || placeholder}
        </div>
        <div className="nsel-arrow" />
      </div>

      {/* menú */}
      {open && (
        <div className="nsel-menu" role="listbox">
          {options.map((opt, i) => {
            const selected = value === opt.value;
            const hover = hoverIdx === i;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={selected}
                className={`nsel-option ${selected ? "is-selected" : ""} ${hover ? "is-hover" : ""}`}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectOption(opt, i)}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
