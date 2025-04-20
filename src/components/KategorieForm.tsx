//components/KategorieForm.tsx
import { useState, useEffect } from 'react'
import KategorieCombobox from './KategorieCombobox'

type Kategorie = {
  id: number
  bezeichnung: string
  kattyp: string
  ober: number
  hidden: number
}

type KategorieFilter = {
  bezeichnung?: string
  kattyp?: string
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
  initialData?: Partial<FormData> // wenn ein Treffer ausgewählt wurde
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

  // 🔁 initialData beim Bearbeiten setzen
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
      NR: isUpdate ? nr! : Date.now(), // Dummy bei Neuanlage
      BEZEICHNUNG: bezeichnung,
      KATTYP: kattyp,
      OBER: ober ? parseInt(ober) : null,
      BESCHREIBUNG: beschreibung,
      hidden: hidden ? 1 : 0,
    }

    onSave(data, isUpdate)
    setError('')
  }

  return (
    <div className="space-y-4 p-4 bg-orange-700 text-white rounded shadow-md">
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
            <option key={typ} value={typ}>
              {typ}
            </option>
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
        <label className="block font-medium">Beschreibung</label>
        <textarea
          value={beschreibung}
          onChange={(e) => setBeschreibung(e.target.value)}
          className="w-full border px-2 py-1 bg-orange-800 rounded"
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

      <div className="flex space-x-2">
        <button
          onClick={handleSearch}
          className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Suche
        </button>
        <button
          onClick={handleSave}
          className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Speichern
        </button>
      </div>
    </div>
  )
}