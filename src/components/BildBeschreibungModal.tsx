//components/BildBeschreibungModal.tsx
import { useEffect, useRef, useState } from "react"
import { useStore } from "../store/StoreContext"
import KategorieCombobox from "./KategorieCombobox"
import type { BildData } from "../types/Bild"

export default function BildBeschreibungModal({
  nr,
  onClose,
}: {
  nr: number
  onClose: (refresh?: boolean) => void
}) {
  const { kategorieStore, suchStore } = useStore()
  const [bild, setBild] = useState<BildData | null>(null)
  const [originalBild, setOriginalBild] = useState<BildData | null>(null)
  const [kategorien, setKategorien] = useState<any[]>([])
  const [vorgeschlageneKategorien, setVorgeschlageneKategorien] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [refreshNeeded, setRefreshNeeded] = useState(false)
  const [lastPicInfo, setLastPicInfo] = useState<{ NR: number; info: string } | null>(null)

  const modalRef = useRef<HTMLDivElement>(null)

  const handleKategorieHinzufuegen = async (katId: string | number) => {
    try {
      await fetch(`http://127.0.0.1:5001/addKat/${bild?.NR}/${katId}`, {
        method: "POST",
      })
      await reloadKategorien()
      setRefreshNeeded(true)
    } catch (err) {
      console.error("Fehler beim Hinzufügen:", err)
    }
  }

  const handleKategorieEntfernen = async (katId: number) => {
    try {
      await fetch(`http://127.0.0.1:5001/remKat/${bild?.NR}/${katId}`, {
        method: "DELETE",
      })
      await reloadKategorien()
      setRefreshNeeded(true)
    } catch (err) {
      console.error("Fehler beim Entfernen:", err)
    }
  }

  const reloadKategorien = async () => {
    const res = await fetch(`http://127.0.0.1:5001/holeKatZuBild/${nr}`)
    const data = await res.json()
    setKategorien(data)
  }

  useEffect(() => {
    const loadBild = async () => {
      const res = await fetch(`http://127.0.0.1:5001/api/bild/${nr}`)
      const data = await res.json()
      const url = `http://127.0.0.1:5001/images/${data.bild.pfad}/${data.bild.datei}`
      const loaded: BildData = {
        NR: data.bild.NR,
        titel: data.bild.titel ?? '',
        datum: data.bild.AUFNAHMEDATUM ?? '',
        kamera: data.bild.kamera ?? '',
        typ: data.bild.typ ?? '',
        url,
        kategorie: data.bild.kategorie ?? '',
        fotograf: data.bild.fotograf ?? '',
      }

      setBild(loaded)
      setOriginalBild(loaded)
    }

    const fetchVorschlaege = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5001/propKat/${nr}/10`)
        const data = await res.json()
        setVorgeschlageneKategorien(data)
      } catch (err) {
        console.error("Fehler beim Laden der Vorschläge:", err)
      }
    }

    const fetchLastPicInfo = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5001/lastPicInfo/${nr}`)
        const data = await res.json()
        setLastPicInfo(data.bild)
      } catch (err) {
        console.error("Fehler beim Laden des vorherigen Bildes:", err)
      }
    }

    loadBild()
    fetchVorschlaege()
    fetchLastPicInfo()
  }, [nr])

  useEffect(() => {
    reloadKategorien()
  }, [nr])

  const handleChange = (field: keyof BildData, value: string) => {
    if (!bild) return
    setBild({ ...bild, [field]: value })
  }

  const hasCriticalChanges = () => {
    return (
      originalBild &&
      (bild?.kamera !== originalBild.kamera || bild?.fotograf !== originalBild.fotograf)
    )
  }

  const confirmCriticalChanges = () => {
    return window.confirm(
      "Du hast Kamera oder Fotograf geändert. Bist du sicher, dass du diese Änderung speichern willst?"
    )
  }

  const handleSave = async () => {
    if (!bild) return

    if (hasCriticalChanges() && !confirmCriticalChanges()) {
      return
    }

    setIsSaving(true)
    try {
      const cleanBild = {
        ...bild,
        datum: bild.datum || "",
        typ: bild.typ || "",
      }

      const res = await fetch(`http://127.0.0.1:5001/api/bild/${cleanBild.NR}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanBild),
      })
      if (!res.ok) throw new Error("Fehler beim Speichern")

      suchStore.updateBild(cleanBild)

      onClose(true)
    } catch (err) {
      console.error(err)
      alert("Speichern fehlgeschlagen")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    onClose(refreshNeeded)
  }

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      if (hasCriticalChanges()) {
        handleSave()
      } else {
        onClose(refreshNeeded)
      }
    }
  }

  const handleSameAsLastPic = async () => {
    if (!lastPicInfo) return

    try {
      const res = await fetch(`http://127.0.0.1:5001/api/sameAsPic/${nr}/${lastPicInfo.NR}`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Fehler beim Übernehmen")

      // Bilddaten aktualisieren
      await reloadKategorien()
      const newBildRes = await fetch(`http://127.0.0.1:5001/api/bild/${nr}`)
      const newData = await newBildRes.json()
      const url = `http://127.0.0.1:5001/images/${newData.bild.pfad}/${newData.bild.datei}`
      setBild({
        ...bild!,
        ...newData.bild,
        url,
      })

      setRefreshNeeded(true)
    } catch (err) {
      console.error("Fehler beim Übernehmen vom vorherigen Bild:", err)
    }
  }

  if (!bild) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded shadow-lg max-w-xl w-full relative space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={bild.url} alt={bild.titel} className="rounded max-w-full" />

        {/* Titel */}
        <div className="flex items-start gap-2">
          <label className="w-24 shrink-0 font-medium pt-1">Titel:</label>
          <textarea
            className="w-full border px-2 py-1 rounded resize-none"
            rows={3}
            value={bild.titel}
            onChange={(e) => handleChange("titel", e.target.value)}
          />
        </div>

        {/* Fotograf */}
        <div className="flex items-center gap-2">
          <label className="w-24 shrink-0 font-medium">Fotograf:</label>
          <input
            className="flex-1 border px-2 py-1 rounded"
            value={bild.fotograf}
            onChange={(e) => handleChange("fotograf", e.target.value)}
          />
        </div>

        {/* Kamera */}
        <div className="flex items-center gap-2">
          <label className="w-24 shrink-0 font-medium">Kamera:</label>
          <input
            className="flex-1 border px-2 py-1 rounded"
            value={bild.kamera}
            onChange={(e) => handleChange("kamera", e.target.value)}
          />
        </div>

        {/* Zugewiesene Kategorien */}
        {kategorien.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 max-h-24 overflow-auto text-xs">
            {kategorien.map((kat) => (
              <span
                key={kat.id}
                onDoubleClick={() => handleKategorieEntfernen(kat.id)}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer hover:bg-red-100"
                title="Doppelklick zum Entfernen"
              >
                {kat.bezeichnung}
              </span>
            ))}
          </div>
        )}

        {/* Kategorie-Combobox */}
        <div className="flex items-center gap-2">
          <label className="w-24 shrink-0 font-medium">weitere Kategorien zuordnen:</label>
          <KategorieCombobox
            kategorien={kategorieStore.kategorien}
            selected={""}
            onChange={(val) => handleKategorieHinzufuegen(val)}
          />
        </div>

        {/* Vorgeschlagene Kategorien */}
        {vorgeschlageneKategorien.length > 0 && (
          <div className="mt-2 text-sm">
            <div className="flex flex-wrap gap-2 text-xs">
              {vorgeschlageneKategorien.map((kat) => (
                <span
                  key={kat.id}
                  onDoubleClick={async () => {
                    await handleKategorieHinzufuegen(kat.id)
                    setVorgeschlageneKategorien((prev) =>
                      prev.filter((k) => k.id !== kat.id)
                    )
                  }}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded cursor-pointer hover:bg-green-100"
                  title={kat.beschreibung || ""}
                >
                  {kat.bezeichnung}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Übernehmen von vorherigem Bild */}
        {lastPicInfo && (
          <div
            className="bg-yellow-100 border border-yellow-400 rounded px-3 py-2 text-sm cursor-pointer hover:bg-yellow-200 relative group select-none"
            title="Doppelklick zum Übernehmen"
            onDoubleClick={handleSameAsLastPic}
          >
            Übernehmen von vorherigem Bild
            <div className="absolute left-0 bottom-full mb-1 w-max max-w-sm bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {lastPicInfo.info}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            {isSaving ? "Speichern..." : "Speichern"}
          </button>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-black"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  )
}