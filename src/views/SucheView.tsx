// src/views/SucheView.tsx

import { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { useStore } from "../store/StoreContext"

interface Props {
  values: {
    text: string
    von: string
    bis: string
    typ: string
    kategorie: string
    kamera: string
    fotograf:string
  }
  onChange: (newValues: Props['values']) => void
  onSearch: () => void
}

function SucheView({ values, onChange, onSearch }: Props) {
  const { kategorieStore } = useStore()

  useEffect(() => {
    kategorieStore.loadKategorien()
    kategorieStore.loadKameras()
    kategorieStore.loadFotografen()
  }, [kategorieStore])

  return (
    <form
      className="space-y-2 text-sm"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
    >
      <input
        type="text"
        placeholder="Suchtext"
        value={values.text}
        onChange={(e) => onChange({ ...values, text: e.target.value })}
        className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white placeholder-white"
      />

      <div className="flex gap-2">
        <input
          type="date"
          value={values.von}
          onChange={(e) => onChange({ ...values, von: e.target.value })}
          className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"
        />
        <input
          type="date"
          value={values.bis}
          onChange={(e) => onChange({ ...values, bis: e.target.value })}
          className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"
        />
      </div>

      <select
        value={values.typ}
        onChange={(e) => onChange({ ...values, typ: e.target.value })}
        className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"
      >
         <option value="">Medientyp wählen</option>
        <option value="B">Bilder</option>
        <option value="V">Videos</option>
      </select>

      <select
        value={values.kategorie}
        onChange={(e) => onChange({ ...values, kategorie: e.target.value })}
        className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"
      >
        <option value="">Kategorie wählen</option>
        {kategorieStore.loading && <option>Lade Kategorien...</option>}
        {kategorieStore.error && (
          <option disabled>Fehler beim Laden</option>
        )}
        {!kategorieStore.loading &&
          kategorieStore.kategorien.map((kat) => (
            <option key={kat.id} value={kat.id}>
              {kat.name}
            </option>
          ))}
      </select>

      <select
        value={values.kamera}
        onChange={(e) => onChange({ ...values, kamera: e.target.value })}
        className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"
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


      <select
        value={values.fotograf}
        onChange={(e) => onChange({ ...values, fotograf: e.target.value })}
        className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"
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




      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
      >
        Suchen
      </button>
    </form>
  )
}

export default observer(SucheView)