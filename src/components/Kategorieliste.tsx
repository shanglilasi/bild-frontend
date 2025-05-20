// src/components/Kategorieliste.tsx
import React from "react"
import KategorieInfo from "./KategorieInfo"
import type { Kategorie } from '../types/Kategorie'



type Props = {
  kategorien: Kategorie[]
  onSelect?: (k: Kategorie) => void
  onAnalyse?: (k: Kategorie) => void
  onView?: (k: Kategorie) => void
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
            kategorie={k}
            onSelect={onSelect}
            onAnalyse={onAnalyse}
            onView={onView}
        
          />
          {renderKategorieTree(k.id, level + 1)}
        </div>
      ))

  return (
    <div className="p-4 bg-white rounded shadow text-sm text-gray-800">
    
      {renderKategorieTree()}
    </div>
  )
}
export default Kategorieliste