// src/components/Kategorieliste.tsx
import React from "react"
import KategorieInfo from "./KategorieInfo"

type KategorieView = {
  id: number
  bezeichnung: string
  kattyp: string
  beschreibung: string
  ober: number | null
  hidden: number
}

type Props = {
  kategorien: KategorieView[]
  onSelect?: (k: KategorieView) => void
  onAnalyse?: (k: KategorieView) => void
  onView?: (k: KategorieView) => void
}

export function Kategorieliste({
  kategorien,
  onSelect,
  onAnalyse,
  onView,
}: Props) {
  const renderKategorieTree = (
    oberId: number | null = 0,
    level: number = 0
  ): React.ReactElement[] =>
    kategorien
      .filter((k) => k.ober === oberId)
      .map((k) => (
        <div key={k.id} style={{ marginLeft: `${level * 1.5}rem` }}>
          <KategorieInfo
            kategorie={{
              id: k.id,
              bezeichnung: k.bezeichnung,
              beschreibung: k.beschreibung,
            }}
            onSelect={onSelect}
            onAnalyse={onAnalyse}
            onView={onView}
          />
          {renderKategorieTree(k.id, level + 1)}
        </div>
      ))

  return (
    <div className="p-4 bg-white rounded shadow text-sm text-gray-800">
      <h2 className="text-lg font-bold mb-2">Kategorien (hierarchisch)</h2>
      {renderKategorieTree()}
    </div>
  )
}
export default Kategorieliste