// src/components/TypeChip.jsx
import React from "react";

/**
 * Mapea el tipo a un colorcito agradable.
 * Si querés más tipos, agregalos abajo.
 */
const palette = {
  standard: { bg: "var(--chip-bg)", br: "var(--chip-br)" },
  doble: { bg: "rgba(37,99,235,.15)", br: "rgba(37,99,235,.45)" },
  triple: { bg: "rgba(147,51,234,.18)", br: "rgba(147,51,234,.48)" },
  cuadruple: { bg: "rgba(16,185,129,.18)", br: "rgba(16,185,129,.48)" },
  suite: { bg: "rgba(199,154,27,.18)", br: "rgba(199,154,27,.48)" },
  deluxe: { bg: "rgba(236,72,153,.18)", br: "rgba(236,72,153,.48)" },
};

export default function TypeChip({ value }) {
  const key = String(value || "").toLowerCase();
  const colors = palette[key] || { bg: "var(--chip-bg)", br: "var(--chip-br)" };
  return (
    <span
      className="type-chip"
      style={{ background: colors.bg, borderColor: colors.br }}
      title={`Tipo: ${value}`}
    >
      {value || "—"}
    </span>
  );
}
