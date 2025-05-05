//components/SucheView.tsx

import { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "../store/StoreContext"
import { format, addYears, subYears, addDays } from 'date-fns'
import KategorieCombobox from '../components/KategorieCombobox'
import { BASE_URL } from '../config';

interface Props {
  values: {
    text: string
    von: string
    bis: string
    typ: string
    kategorie: string
    kamera: string
    fotograf: string
    noKategorie: boolean
    noTitle: boolean
  }
  onChange: (newValues: Props['values']) => void
  onSearch: () => void
}

function SucheView({ values, onChange, onSearch }: Props) {
  const { kategorieStore } = useStore()
  const { suchStore } = useStore()
  const { results } = suchStore

  const [tooManyResultsInfo, setTooManyResultsInfo] = useState<null | { count: number; datum_X?: string }>(null)
  const [forceSearch, setForceSearch] = useState(false)

  useEffect(() => {
    kategorieStore.loadKategorien()
    kategorieStore.loadKameras()
    kategorieStore.loadFotografen()
  }, [kategorieStore])

  useEffect(() => {
    if (forceSearch) {
      onSearch()
      setForceSearch(false)
    }
  }, [forceSearch, onSearch])

  const inputStyle = (val: string) =>
    `w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 ${
      val ? 'text-white' : 'text-gray-400 italic'
    }`

  const updateDatum = (newVon: Date, newBis: Date) => {
    onChange({
      ...values,
      von: format(newVon, 'yyyy-MM-dd'),
      bis: format(newBis, 'yyyy-MM-dd'),
    })
  }

  const handleSearch = async (forceFullSearch = false) => {
    const searchParams = {
      text: values.text,
      datum_von: values.von,
      datum_bis: values.bis,
      typ: values.typ,
      kategorie: values.kategorie,
      kamera: values.kamera,
      fotograf: values.fotograf,
      noKategorie: values.noKategorie,
      noTitle: values.noTitle,
      maxResults: 1000,
      richtung: "rückwärts",
    }

    try {
      if (!forceFullSearch) {
        const res = await fetch(`${BASE_URL}/bilder/searchCount`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(searchParams),
        })

        const data = await res.json()

        if (data.count > searchParams.maxResults) {
          setTooManyResultsInfo({ count: data.count, datum_X: data.datum_X })
          return
        }
      }
      setForceSearch(true)
    } catch (error) {
      console.error("Fehler bei der Suche:", error)
      alert("Fehler beim Suchen. Bitte später erneut versuchen.")
    }
  }

  const handleJahrPlus = () => updateDatum(addYears(new Date(values.von), 1), addYears(new Date(values.bis), 1))
  const handleJahrMinus = () => updateDatum(subYears(new Date(values.von), 1), subYears(new Date(values.bis), 1))
  const handleFolgeJahr = () => updateDatum(new Date(values.bis), addYears(new Date(values.bis), 1))
  const handleVorJahr = () => updateDatum(subYears(new Date(values.von), 1), new Date(values.von))
  const handleLetztesJahr = () => updateDatum(subYears(new Date(), 1), new Date())
  const handleHeute = () => updateDatum(new Date(), addDays(new Date(), 1))
  const handleMax = () => updateDatum(subYears(new Date(), 100), new Date())

  return (
    <>
      <form
        className="space-y-2 text-sm"
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
      >
        <input
          type="text"
          placeholder="Suchtext"
          value={values.text}
          onChange={(e) => onChange({ ...values, text: e.target.value })}
          className={inputStyle(values.text)}
        />

        <KategorieCombobox
          kategorien={kategorieStore.kategorien}
          selected={values.kategorie}
          onChange={(val) => onChange({ ...values, kategorie: val })}
        />

        <div className="flex gap-2">
          <input
            type="date"
            value={values.von}
            onChange={(e) => onChange({ ...values, von: e.target.value })}
            className={inputStyle(values.von)}
          />
          <input
            type="date"
            value={values.bis}
            onChange={(e) => onChange({ ...values, bis: e.target.value })}
            className={inputStyle(values.bis)}
          />
        </div>

        <div className="flex flex-wrap gap-1">
          <div className="flex gap-4">
            <div className="flex flex-col gap-1">
              <button type="button" onClick={handleJahrMinus} className="bg-blue-500 text-white text-xs px-1 py-1 rounded hover:bg-blue-600">J-..J-</button>
              <button type="button" onClick={handleJahrPlus} className="bg-blue-500 text-white text-xs px-1 py-1 rounded hover:bg-blue-600">J+..J+</button>
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" onClick={handleVorJahr} className="bg-blue-400 text-white text-xs px-1 py-1 rounded hover:bg-blue-500">|Vorjahr</button>
              <button type="button" onClick={handleFolgeJahr} className="bg-blue-400 text-white text-xs px-1 py-1 rounded hover:bg-blue-500">Folgejahr|</button>
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" onClick={handleLetztesJahr} className="bg-green-500 text-white text-xs px-1 py-1 rounded hover:bg-green-600">Jahr</button>
              <button type="button" onClick={handleHeute} className="bg-green-500 text-white text-xs px-1 py-1 rounded hover:bg-green-600">Heute</button>
            </div>
            <div className="flex flex-col gap-1">
              <button type="button" onClick={handleMax} className="bg-orange-500 text-white text-xs px-1 py-1 rounded hover:bg-orange-600">M a x</button>
            </div>
          </div>
        </div>

        <select value={values.typ} onChange={(e) => onChange({ ...values, typ: e.target.value })} className={inputStyle(values.typ)}>
          <option value="">Medientyp wählen</option>
          <option value="B">Bilder</option>
          <option value="V">Videos</option>
        </select>

        <select value={values.kamera} onChange={(e) => onChange({ ...values, kamera: e.target.value })} className={inputStyle(values.kamera)}>
          <option value="">Kamera wählen</option>
          {kategorieStore.kameras.map((kamera) => (
            <option key={kamera.name} value={kamera.name}>{kamera.name}</option>
          ))}
        </select>

        <select value={values.fotograf} onChange={(e) => onChange({ ...values, fotograf: e.target.value })} className={inputStyle(values.fotograf)}>
          <option value="">Fotograf wählen</option>
          {kategorieStore.fotografen.map((fotograf) => (
            <option key={fotograf.name} value={fotograf.name}>{fotograf.name}</option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="noKategorie" checked={values.noKategorie} onChange={(e) => onChange({ ...values, noKategorie: e.target.checked })} />
          <label htmlFor="noKategorie" className="text-white">Ohne Kategorie</label>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="noTitle" checked={values.noTitle} onChange={(e) => onChange({ ...values, noTitle: e.target.checked })} />
          <label htmlFor="noTitle" className="text-white">Ohne Titel</label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700">Suchen</button>

        {results.length > 0 && <p className="text-sm text-gray-600">{results.length} Treffer gefunden.</p>}
      </form>

      {tooManyResultsInfo && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full space-y-4 text-center">
            <p className="text-lg font-semibold">{tooManyResultsInfo.count} Treffer gefunden</p>
            <p className="text-sm text-gray-600">Wie möchtest du fortfahren?</p>
            <div className="space-y-2">
              {tooManyResultsInfo.datum_X && (
                <button
                  onClick={() => {
                    onChange({ ...values, von: tooManyResultsInfo.datum_X! })
                    setTooManyResultsInfo(null)
                    setForceSearch(true)
                  }}
                  className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                >
                  📆 Zeitraum anpassen (ab {tooManyResultsInfo.datum_X})
                </button>
              )}
              <button
                onClick={() => {
                  setTooManyResultsInfo(null)
                  setForceSearch(true)
                }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                ✅ Alle laden ({tooManyResultsInfo.count})
              </button>
              <button
                onClick={() => setTooManyResultsInfo(null)}
                className="w-full bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
              >
                ❌ Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default observer(SucheView)
