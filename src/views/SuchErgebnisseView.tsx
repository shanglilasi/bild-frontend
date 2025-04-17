// src/views/SuchErgebnisseView.tsx

import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'
import PIC from '../components/PIC'


const SuchErgebnisseView = observer(() => {
  const { suchStore } = useStore()

  const {
    filteredResults,
    sortField,
    sortOrder,
    setSort,
    setFilter,
    activeFilters,
  } = suchStore

  const sorted = [...filteredResults].sort((a, b) => {
    //let valA = a[sortField]
    //let valB = b[sortField]

    let valA = a[sortField as keyof typeof a]
    let valB = b[sortField as keyof typeof b]

    if (valA == null) valA = ''
    if (valB == null) valB = ''

    if (sortField === 'datum') {
      const dateA = valA ? new Date(valA as string).getTime() : 0
      const dateB = valB ? new Date(valB as string).getTime() : 0
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    }

    valA = valA.toString().toLowerCase()
    valB = valB.toString().toLowerCase()

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })


  // Unique Kameras extrahieren und sortieren
  const uniqueCameras = Array.from(new Set(filteredResults.map(bild => bild.kamera))).sort()


  return (
    <div>
      {/* Filter & Sort UI */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        {['titel', 'datum', 'kamera'].map((field) => (
          <button
            key={field}
            onClick={() => setSort(field)}
            className={`text-sm px-2 py-1 rounded border ${
              sortField === field ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {field} {sortField === field ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
          </button>
        ))}

<select
  value={activeFilters.kamera}
  onChange={(e) => setFilter('kamera', e.target.value)}
  className="bg-white border rounded px-3 py-2 ml-2"
>
  <option value="">Alle Kameras</option>
  {uniqueCameras.map(kamera => (
    <option key={kamera} value={kamera}>
      {kamera}
    </option>
  ))}
</select>

        <select
          value={activeFilters.kategorie}
          onChange={(e) => setFilter('kategorie', e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Alle Kategorien</option>
          <option value="Natur">Natur</option>
          <option value="Technik">Technik</option>
          <option value="Tiere">Tiere</option>
        </select>
      </div>

      {/* Ergebnis-Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sorted.map((bild) => (
        
          <PIC key={bild.NR} data={bild} />
        ))}
      </div>
    </div>
  )
})

export default SuchErgebnisseView