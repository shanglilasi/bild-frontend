import { observer } from 'mobx-react-lite'
import suchStore from '../store/SuchStore'
import PIC from '../components/PIC'


const SuchErgebnisseView = observer(() => {
  const {
    filteredResults,
    sortField,
    sortOrder,
    setSort,
    setFilter,
    activeFilters,
  } = suchStore

  const sortedx = [...filteredResults].sort((a, b) => {
    const valA = a[sortField]?.toString().toLowerCase() ?? ''
    const valB = b[sortField]?.toString().toLowerCase() ?? ''
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const sorted = [...filteredResults].sort((a, b) => {
    const { sortField, sortOrder } = suchStore
  
    let valA = a[sortField]
    let valB = b[sortField]
  
    // Fallback auf leere Strings
    if (valA == null) valA = ''
    if (valB == null) valB = ''
  
    // Wenn Datum -> echte Date-Objekte vergleichen
    if (sortField === 'datum') {
      valA = new Date(valA)
      valB = new Date(valB)
      return sortOrder === 'asc'
        ? valA - valB
        : valB - valA
    }
  
    // Strings vergleichen
    valA = valA.toString().toLowerCase()
    valB = valB.toString().toLowerCase()
  
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })





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

        {/* Kamera-Filter */}
        <select
          value={activeFilters.kamera}
          onChange={(e) => setFilter('kamera', e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">Alle Kameras</option>
          <option value="Canon">Canon</option>
          <option value="Nikon">Nikon</option>
          <option value="Sony">Sony</option>
        </select>

        {/* Kategorie-Filter */}
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
        {sorted.map((bild, i) => (
          <PIC key={i} data={bild} />
        ))}
      </div>
    </div>
  )
})

export default SuchErgebnisseView