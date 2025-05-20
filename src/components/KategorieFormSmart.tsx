// components/KategorieFormSmart.tsx
import { useState } from 'react'
import KategorieForm from './KategorieForm'
import DatensatzNavigation from './DatensatzNavigation'
import { useStore } from '../store/StoreContext'

export default function KategorieFormSmart() {
  const { kategorieStore } = useStore()
  const [successMsg, setSuccessMsg] = useState('')
  const [treffer, setTreffer] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const kategorien = kategorieStore.kategorien

  const handleSearch = (filter: {
    bezeichnung?: string
    kattyp?: string
    ober?: number | null
    hidden?: number
  }) => {
    const results = kategorien.filter((k) => {
      return (
        (!filter.bezeichnung || k.bezeichnung.toLowerCase().includes(filter.bezeichnung.toLowerCase())) &&
        (!filter.kattyp || k.kattyp === filter.kattyp) &&
        (filter.ober === undefined || k.ober === filter.ober) &&
        (filter.hidden === undefined || k.hidden === filter.hidden)
      )
    })
    setTreffer(results)
    setActiveIndex(results.length > 0 ? 0 : null)
  }

  const handleSave = async (data: any, isUpdate: boolean) => {
    const url = isUpdate
      ? `http://localhost:5001/kategorien/kategorie/${data.NR}`
      : `http://localhost:5001/kategorien/kategorie`

    const res = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await res.json()

    if (!res.ok) {
      alert(`Fehler: ${result.error}`)
      return
    }

    // nach dem Speichern neu laden
    await kategorieStore.loadKategorien()

    // Erfolgsmeldung anzeigen
    setSuccessMsg('✅ Kategorie erfolgreich gespeichert')
    setTimeout(() => setSuccessMsg(''), 3000)

    // zurück zur Suche
    setTreffer([])
    setActiveIndex(null)
  }

  const activeData = activeIndex !== null ? treffer[activeIndex] : undefined

  return (
    <div className="space-y-2">
      {successMsg && (
        <div className="bg-green-600 text-white px-4 py-2 rounded text-sm shadow">
          {successMsg}
        </div>
      )}

      <KategorieForm
        kategorien={kategorien}
        onSave={handleSave}
        onSearch={handleSearch}
        initialData={
          activeData
            ? {
                NR: activeData.id,
                BEZEICHNUNG: activeData.bezeichnung,
                KATTYP: activeData.kattyp,
                OBER: activeData.ober,
                BESCHREIBUNG: activeData.beschreibung ?? '',
                hidden: activeData.hidden,
              }
            : undefined
        }
      />

      {treffer.length > 0 && activeIndex !== null && (
        <DatensatzNavigation
          index={activeIndex}
          total={treffer.length}
          onPrev={() => setActiveIndex((i) => Math.max((i ?? 1) - 1, 0))}
          onNext={() =>
            setActiveIndex((i) =>
              Math.min((i ?? 0) + 1, treffer.length - 1)
            )
          }
        />
      )}

      {treffer.length > 0 && activeIndex !== null && (
        <div className="bg-orange-100 text-orange-900 p-2 rounded text-sm flex justify-between items-center">
          Bearbeitung: {treffer[activeIndex].bezeichnung}
          <button
            className="text-xs underline hover:text-orange-600"
            onClick={() => {
              setActiveIndex(null)
              setTreffer([])
            }}
          >
            Zurück zur Suche
          </button>
        </div>
      )}
    </div>
  )
}