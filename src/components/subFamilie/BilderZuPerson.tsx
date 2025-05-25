//src/components/subFamilie/BilderZuPerson.tsx
import { useEffect, useState } from "react"
import { BASE_URL } from "../../config"
import PIC from "../subBilder/PIC"

type BildData = {
  NR: number
  DATEI: string
  PFAD: string
  AUFNAHMEDATUM: string
  Fotograf: string
  Kammera: string
  Pixel_x: number
  Pixel_y: number
  STICHWORTE?: string
}

export default function BilderZuPerson({
  categoryId,
  max = 3,
}: {
  categoryId: number | undefined
  max?: number
}) {
  const [bilder, setBilder] = useState<BildData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!categoryId) return
    setLoading(true)
    fetch(`${BASE_URL}/ahnen/bilder/${categoryId}/${max}`)
      .then((res) => res.json())
      .then((data) => setBilder(data))
      .catch((err) => console.error("Fehler beim Laden der Bilder:", err))
      .finally(() => setLoading(false))
  }, [categoryId, max])

  if (!categoryId) return null
  if (loading) return <p className="text-gray-500">🔄 Lade Bilder...</p>
  if (bilder.length === 0) return <p className="text-gray-500">Keine Bilder gefunden.</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {bilder.map((bild) => (
        <PIC
          key={bild.NR}
          data={{
            NR: bild.NR,
            datei: bild.DATEI,
            titel: bild.STICHWORTE || "",
            datum: bild.AUFNAHMEDATUM,
            kamera: bild.Kammera,
            typ: "", // wenn vorhanden
            url: `${BASE_URL}/utils/images/${bild.PFAD}/${bild.DATEI}`,
            kategorie: "", // optional
            fotograf: bild.Fotograf,
          }}
        />
      ))}
    </div>
  )
}