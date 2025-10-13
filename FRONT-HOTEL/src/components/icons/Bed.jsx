// src/components/icons/Bed.jsx
import React from "react";

/**
 * Ícono de cama simple. Podés cambiar size con la prop "size" (px).
 */
export default function Bed({ size = 18, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      <path d="M4 10V7a2 2 0 0 1 2-2h6a3 3 0 0 1 3 3v2h3a3 3 0 0 1 3 3v5h-2v-2H3v2H1v-6a5 5 0 0 1 5-5H4Zm2 0h7V8a1 1 0 0 0-1-1H6v3Z" />
    </svg>
  );
}
