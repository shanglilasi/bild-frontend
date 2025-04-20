// src/views/SucheView.tsx

import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "../store/StoreContext"
// Importiere Hilfsfunktion zur Datumshandhabung
import { format, addYears, subYears, subDays, addDays } from 'date-fns'
import KategorieCombobox from '../components/KategorieCombobox'

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


  useEffect(() => {
    kategorieStore.loadKategorien()
    kategorieStore.loadKameras()
    kategorieStore.loadFotografen()
  }, [kategorieStore])

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
  
    const handleJahrPlus = () => {
      const vonDate = new Date(values.von)
      const bisDate = new Date(values.bis)
      updateDatum(addYears(vonDate, 1), addYears(bisDate, 1))
    }
  
    const handleJahrMinus = () => {
      const vonDate = new Date(values.von)
      const bisDate = new Date(values.bis)
      updateDatum(subYears(vonDate, 1), subYears(bisDate, 1))
    }
  
    const handleLetztesJahr = () => {
      const heute = new Date()
      const vorEinemJahr = subYears(heute, 1)
      updateDatum(vorEinemJahr, heute)
    }
  
    const handleHeute = () => {
      const heute = new Date()
      const morgen = addDays(heute, 1)
      updateDatum(heute, morgen)
    }

    const handleMax = () => {
      const heute = new Date()
      const damals = subYears(heute, 100)
      updateDatum(damals, heute)
    }




  return (
    <form
      className="space-y-2 text-sm"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
      {/* Suchtext */}
      <input
        type="text"
        placeholder="Suchtext"
        value={values.text}
        onChange={(e) => onChange({ ...values, text: e.target.value })}
        className={inputStyle(values.text)}
      />

      {/* Kategorie (Combobox hat eigenes Verhalten) */}
      <KategorieCombobox
        kategorien={kategorieStore.kategorien}
        selected={values.kategorie}
        onChange={(val) => onChange({ ...values, kategorie: val })}
      />

      {/* Datum von - bis */}
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


{/* Aktionsbuttons für Datum */}

{/* Aktionsbuttons für Datum */}
<div className="flex flex-wrap gap-1">
  <button
    type="button"
    title="Beide Datumsfelder um ein Jahr rückwärts"
    onClick={handleJahrMinus}
    className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-700"
  >
    J-
  </button>
  <button
    type="button"
    title="Beide Datumsfelder um ein Jahr vor"
    onClick={handleJahrPlus}
    className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-700"
  >
    J+
  </button>
  <button
    type="button"
    onClick={handleLetztesJahr}
    title="Ein Jahr ab heute rückwärts"
    className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-700"
  >
    J
  </button>
  <button
    type="button"
     title="Heute"
    onClick={handleHeute}
    className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-700"
  >
    H
  </button>
  <button
    type="button"
   
    onClick={handleMax}
    className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded hover:bg-blue-700"
  >
    Max
  </button>
</div>


      {/* Medientyp */}
      <select
        value={values.typ}
        onChange={(e) => onChange({ ...values, typ: e.target.value })}
        className={inputStyle(values.typ)}
      >
        <option value="">Medientyp wählen</option>
        <option value="B">Bilder</option>
        <option value="V">Videos</option>
      </select>

      {/* Kamera */}
      <select
        value={values.kamera}
        onChange={(e) => onChange({ ...values, kamera: e.target.value })}
        className={inputStyle(values.kamera)}
      >
        <option value="">Kamera wählen</option>
        {kategorieStore.kamerasLoading && <option>Lade Kameras...</option>}
        {kategorieStore.kamerasError && (
          <option disabled>Fehler beim Laden</option>
        )}
        {!kategorieStore.kamerasLoading &&
          !kategorieStore.kamerasError &&
          kategorieStore.kameras.map((kamera) => (
            <option key={kamera.name} value={kamera.name}>
              {kamera.name}
            </option>
          ))}
      </select>

      {/* Fotograf */}
      <select
        value={values.fotograf}
        onChange={(e) => onChange({ ...values, fotograf: e.target.value })}
        className={inputStyle(values.fotograf)}
      >
        <option value="">Fotograf wählen</option>
        {kategorieStore.fotografenLoading && <option>Lade Fotograf...</option>}
        {kategorieStore.fotografenError && (
          <option disabled>Fehler beim Laden fotograf</option>
        )}
        {!kategorieStore.fotografenLoading &&
          !kategorieStore.fotografenError &&
          kategorieStore.fotografen.map((fotograf) => (
            <option key={fotograf.name} value={fotograf.name}>
              {fotograf.name}
            </option>
          ))}
      </select>
{/* Checkbox: NoKategorie */}
<div className="flex items-center space-x-2">
  <input
    type="checkbox"
    id="noKategorie"
    checked={values.noKategorie}
    onChange={(e) => onChange({ ...values, noKategorie: e.target.checked })}
  />
  <label htmlFor="noKategorie" className="text-white">Ohne Kategorie</label>
</div>

{/* Checkbox: NoTitle */}
<div className="flex items-center space-x-2">
  <input
    type="checkbox"
    id="noTitle"
    checked={values.noTitle}
    onChange={(e) => onChange({ ...values, noTitle: e.target.checked })}
  />
  <label htmlFor="noTitle" className="text-white">Ohne Titel</label>
</div>

      {/* Suchbutton */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
      >
        Suchen
      </button>


      {results.length > 0 && (
          <p className="text-sm text-gray-600">
            {results.length} Treffer gefunden.
          </p>
        )}
    </form>
  )
}

export default observer(SucheView)