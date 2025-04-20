//components/Kategorieliste.tsx

import React from "react"

type Kategorie = {
  id: number
  bezeichnung: string
  kattyp: string
  ober: number | null
  hidden: number
}

type Props = {
  kategorien: Kategorie[]
}

const KategorieListe: React.FC<Props> = ({ kategorien }) => {
  // Rekursive Funktion zum Aufbauen der Struktur
  const renderKategorieTree = (oberId: number | null = 0, level: number = 0): JSX.Element[] => {
    return kategorien
      .filter((kat) => kat.ober === oberId)
      .map((kat) => (
        <div key={kat.id} style={{ marginLeft: `${level * 1.5}rem` }}>
          <span className="font-mono" title={"Nummer " + kat.id +  " innerhalb der Kategorie  " + kat.ober + " . Typ: " + kat.kattyp }>
           {kat.bezeichnung} {kat.hidden ? "🚫" : ""}
          </span>
          {renderKategorieTree(kat.id, level + 1)}
        </div>
      ))
  }

  return (
    <div className="p-4 bg-white rounded shadow text-sm text-gray-800">
      <h2 className="text-lg font-bold mb-2">Kategorien (hierarchisch)</h2>
      {renderKategorieTree()}
    </div>
  )
}

export default KategorieListe