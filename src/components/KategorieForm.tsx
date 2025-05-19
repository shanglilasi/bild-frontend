import { useState, useEffect } from 'react'
import KategorieCombobox from './KategorieCombobox'
import KategorieListe from './Kategorieliste'
import { useStore } from '../store/StoreContext'
import { BASE_URL } from '../config'
import Modal from './Modal'
type Kategorie = {
  id: number
  bezeichnung: string
  kattyp: string
  beschreibung: string
  ober: number | null
  hidden: number
}

type KategorieFilter = {
  bezeichnung?: string
  kattyp?: string
  beschreibung?: string
  ober?: number | null
  hidden?: number
}

type FormData = {
  NR: number | null
  BEZEICHNUNG: string
  KATTYP: string
  OBER: number | null
  BESCHREIBUNG: string
  hidden: number
}

type Props = {
  kategorien: Kategorie[]
  onSearch: (filter: KategorieFilter) => void
  onSave: (data: FormData, isUpdate: boolean) => void
  initialData?: Partial<FormData>
}

export default function KategorieForm({
  kategorien,
  onSearch,
  onSave,
  initialData,
}: Props) {
  const [nr, setNr] = useState<number | null>(null)
  const [bezeichnung, setBezeichnung] = useState('')
  const [kattyp, setKattyp] = useState('')
  const [ober, setOber] = useState('')
  const [beschreibung, setBeschreibung] = useState('')
  const [hidden, setHidden] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { suchStore, kategorieStore } = useStore()

  useEffect(() => {
    if (initialData) {
      setNr(initialData.NR ?? null)
      setBezeichnung(initialData.BEZEICHNUNG ?? '')
      setKattyp(initialData.KATTYP ?? '')
      setOber(initialData.OBER?.toString() ?? '')
      setBeschreibung(initialData.BESCHREIBUNG ?? '')
      setHidden(initialData.hidden === 1)
    }
  }, [initialData])

  const uniqueKattyp = Array.from(new Set(kategorien.map((k) => k.kattyp))).sort()

  const handleSearch = () => {
    onSearch({
      bezeichnung: bezeichnung || undefined,
      kattyp: kattyp || undefined,
      ober: ober ? parseInt(ober) : undefined,
      hidden: hidden ? 1 : 0,
    })
  }

  const handleSave = () => {
    const isUpdate = !!nr

    if (!bezeichnung || !kattyp) {
      setError('Bezeichnung und Kategorietyp sind erforderlich.')
      return
    }

    if (!isUpdate && kategorien.some(k => k.bezeichnung.toLowerCase() === bezeichnung.toLowerCase())) {
      setError('Ein Eintrag mit dieser Bezeichnung existiert bereits.')
      return
    }

    const data: FormData = {
      NR: isUpdate ? nr! : Date.now(),
      BEZEICHNUNG: bezeichnung,
      KATTYP: kattyp,
      OBER: ober ? parseInt(ober) : null,
      BESCHREIBUNG: beschreibung,
      hidden: hidden ? 1 : 0,
    }

    onSave(data, isUpdate)
    setError('')
  }

  const handleReset = () => {
    setNr(null)
    setBezeichnung('')
    setKattyp('')
    setOber('')
    setBeschreibung('')
    setHidden(false)
    setError('')
  }

  const handleMassenzuweisung = async () => {
    const kat = kategorien.find(k => k.bezeichnung === bezeichnung && k.kattyp === kattyp)
    if (!kat) {
      alert("Kategorie nicht gefunden oder unvollständig.")
      return
    }

    const treffer = suchStore.results
    if (!treffer.length) {
      alert("Keine Treffer gefunden.")
      return
    }

    const confirmed = window.confirm(`Allen ${treffer.length} Treffern die Kategorie "${kat.bezeichnung}" zuweisen?`)
    if (!confirmed) return

    try {
      const promises = treffer.map(bild =>
        fetch(`${BASE_URL}/bilder/addKat/${bild.NR}/${kat.id}`, { method: "POST" })
      )
      await Promise.all(promises)
      alert("Kategorie erfolgreich allen Treffern zugewiesen.")
    } catch (err) {
      console.error("Fehler bei der Massenzuweisung:", err)
      alert("Zuweisung fehlgeschlagen.")
    }
  }

  return (
    <div className="space-y-4 p-4 bg-orange-700 text-white rounded shadow-md relative">
      {/* Eingabefelder */}
      <div>
        <label className="block font-medium">Bezeichnung</label>
        <input
          value={bezeichnung}
          onChange={(e) => setBezeichnung(e.target.value)}
          className="w-full border px-2 py-1 bg-orange-800 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Kategorietyp</label>
        <select
          value={kattyp}
          onChange={(e) => setKattyp(e.target.value)}
          className="w-full border px-2 py-1 bg-orange-800 rounded"
        >
          <option value="">Bitte wählen</option>
          {uniqueKattyp.map((typ) => (
            <option key={typ} value={typ}>{typ}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium">Oberkategorie</label>
        <KategorieCombobox
          kategorien={kategorien}
          selected={ober}
          onChange={setOber}
        />
      </div>

      <div>
        <label className="block font-medium text-xs">Beschreibung</label>
        <textarea
          value={beschreibung}
          onChange={(e) => setBeschreibung(e.target.value)}
          rows={4}
          className="w-full border px-2 py-1 bg-orange-800 rounded text-xs resize-vertical"
          placeholder="Beschreibung eingeben..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={hidden}
          onChange={(e) => setHidden(e.target.checked)}
        />
        <label>Versteckt</label>
      </div>

      {error && <div className="text-red-400">{error}</div>}

      {nr !== null && (
        <button
          type="button"
          onClick={handleMassenzuweisung}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
        >
          Allen Bildern zuweisen
        </button>
      )}

      <div className="flex flex-wrap gap-2">
        <button onClick={handleSearch} className="hover:bg-gray-500 text-white px-2 rounded">
          🔍
        </button>
        <button onClick={handleSave} className="hover:bg-blue-700 text-white px-2 rounded">
          ✅
        </button>
        <button onClick={handleReset} className="hover:bg-red-700 text-white px-2 rounded">
          ✖️
        </button>
      </div>

      {/* Modal-Kategorieliste */}
      <div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="text-xs underline hover:text-blue-200"
        >
          Kategorieliste anzeigen
        </button>
      </div>

      {showModal && (
  <Modal onClose={() => setShowModal(false)}>
    <h2 className="text-lg font-bold mb-4 text-gray-800">Kategorieliste</h2>
    <KategorieListe kategorien={kategorieStore.kategorien} />
  </Modal>
)}
    </div>
  )
}