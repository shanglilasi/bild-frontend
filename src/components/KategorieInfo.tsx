// src/components/KategorieInfo.tsx

import type { Kategorie } from '../types/Kategorie'


export default function KategorieInfo({
  kategorie,
  onSelect,
  onAnalyse,
  onView,
}: {
  kategorie: Kategorie
  onSelect?: (k: Kategorie) => void
  onAnalyse?: (k: Kategorie) => void
  onView?: (k: Kategorie) => void
}) {
  const hasActions = onSelect || onAnalyse || onView

  return (
    <div
      className="group flex items-center pr-2 mb-1"
      title={`${kategorie.id}: ${kategorie.beschreibung}`}
    >
      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
        {kategorie.bezeichnung}
      </span>

      {hasActions && (
        <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onSelect && (
            <button
              onClick={() => onSelect(kategorie)}
              className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 rounded px-1"
              title="Bearbeiten"
            >
              ✏️
            </button>
          )}
          {onAnalyse && (
            <button
              onClick={() => onAnalyse(kategorie)}
              className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded px-1"
              title="Zeithorizont analysieren"
            >
              📈
            </button>
          )}
          {onView && (
            <button
              onClick={() => onView(kategorie)}
              className="text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 rounded px-1"
              title="Ansicht"
            >
              👁️
            </button>
          )}
        </div>
      )}
    </div>
  )
}