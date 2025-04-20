import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'
import KategorieForm from '../components/KategorieForm'
import DatensatzNavigator from '../components/DatensatzNavigation'

type Kategorie = {
  id: number
  bezeichnung: string
  kattyp: string
  ober: number | null
  hidden: number
  beschreibung?: string
}

const KategorieManagerView: React.FC = observer(() => {
  const { kategorieStore } = useStore()

  const [treffer, setTreffer] = useState<Kategorie[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handleSearch = (filter: Partial<Kategorie>) => {
    const results = kategorieStore.kategorien.filter((k) => {
      return (
        (!filter.bezeichnung ||
          k.bezeichnung.toLowerCase().includes(filter.bezeichnung.toLowerCase())) &&
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
      ? `http://localhost:5001/api/kategorien/${data.NR}`
      : `http://localhost:5001/api/kategorien`

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

    // Kategorien neu laden
    await kategorieStore.loadKategorien()

    // Neue Suche mit aktuellem Eintrag (optional)
    handleSearch({ bezeichnung: data.BEZEICHNUNG })

    alert(isUpdate ? 'Kategorie aktualisiert' : 'Kategorie gespeichert')
  }

  const activeData = activeIndex !== null ? treffer[activeIndex] : undefined

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Kategorien verwalten</h2>

      <KategorieForm
        kategorien={kategorieStore.kategorien}
        onSearch={handleSearch}
        onSave={handleSave}
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
        <DatensatzNavigator
          index={activeIndex}
          total={treffer.length}
          onPrev={() =>
            setActiveIndex((i) => Math.max((i ?? 1) - 1, 0))
          }
          onNext={() =>
            setActiveIndex((i) =>
              Math.min((i ?? 0) + 1, treffer.length - 1)
            )
          }
        />
      )}
    </div>
  )
})

export default KategorieManagerView