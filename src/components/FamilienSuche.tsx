import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useNavigate } from 'react-router-dom'

export default function FamilienSuche() {
  const { familienStore } = useStore()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (query.trim().length < 2) return
    familienStore.search(query)
  }

  return (
    <div className="space-y-2 text-sm">
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
        <table className="mt-4 w-full text-sm text-left border-collapse">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Geburtsdatum</th>
              <th className="p-2 border">Geburtsname</th>
              <th className="p-2 border">Geschlecht</th>
              <th className="p-2 border">Aktion</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 text-white">
            {familienStore.treffer.map((person: any) => (
              <tr key={person.id} className="hover:bg-blue-700">
                <td className="p-2 border">{person.name}</td>
                <td className="p-2 border">{person.geb_dat ?? '—'}</td>
                <td className="p-2 border">{person.geb_name ?? '—'}</td>
                <td className="p-2 border">{person.geschlecht?.toUpperCase() ?? '—'}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => navigate(`/person/${person.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-white text-xs"
                  >
                    Anzeigen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}