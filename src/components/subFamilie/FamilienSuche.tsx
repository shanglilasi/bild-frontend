//src/components/subFamilie/FamilienSuche.tsx
import { useState } from 'react'
import { useStore } from '../../store/StoreContext'
import { observer } from 'mobx-react-lite'
import PersonElement from './PersonElement'


const FamilienSuche = observer(() => {
  const { familienStore } = useStore()
  const [query, setQuery] = useState('')


  const handleSearch = () => {
    if (query.trim().length < 2) return
    familienStore.search(query)
  }


  return (
    <div className="space-y-6 text-sm">
      {/* 🔍 Suche */}
      <div className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name oder ID"
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-1 rounded"
        >
          🔍 Suchen
        </button>

        {familienStore.treffer.length > 0 && (
          <div className="space-y-2 bg-gray-900 p-2 rounded">
            {familienStore.treffer.map((person: any) => (
              <PersonElement
                key={person.id}
                id={person.id}
                name={`${person.name}, ${person.geb_dat ?? ''}`}
                className="w-full text-left bg-white shadow-sm border hover:shadow-md"
              />
            ))}
          </div>
        )}
      </div>

    


    </div>
  )
})

export default FamilienSuche