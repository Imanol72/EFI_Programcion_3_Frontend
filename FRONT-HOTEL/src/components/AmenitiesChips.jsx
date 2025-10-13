// src/components/AmenitiesChips.jsx
import { Tag } from "primereact/tag";
import { AMENITY_ICONS } from "../ui/amenities";

export default function AmenitiesChips({ list = [] }) {
  if (!list?.length) return <span style={{ opacity: 0.7 }}>Sin amenities</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {list.map((key) => {
        const a = AMENITY_ICONS[key];
        return a ? <Tag key={key} value={a.label} icon={a.icon} rounded /> : null;
      })}
    </div>
  );
}
