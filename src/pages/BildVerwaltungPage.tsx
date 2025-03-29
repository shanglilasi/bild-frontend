import { useState } from 'react'
import SuchErgebnisseView from '../views/SuchErgebnisseView'

export default function BildVerwaltungPage() {
  const [searchResults, setSearchResults] = useState<any[]>([])

  return (
    <div className="flex">
      <main className="flex-1 p-4">
        {searchResults.length > 0 ? (
          <SuchErgebnisseView results={searchResults} />
        ) : (
          <p className="text-gray-500">Bitte eine Aktion im Menü wählen.</p>
        )}
      </main>
    </div>
  )
}