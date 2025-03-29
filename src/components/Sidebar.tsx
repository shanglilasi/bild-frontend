import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import SucheView from '../views/SucheView'

export default function Sidebar({ onSearch }: { onSearch: (values: any) => void }) {
  const location = useLocation()
  const isBildverwaltung = location.pathname.startsWith('/bilder')

  const [menuOpen, setMenuOpen] = useState(true)
  const [selectedView, setSelectedView] = useState<string | null>(null)

  // Formularwerte persistent halten
  const [sucheValues, setSucheValues] = useState({
    text: '',
    von: '',
    bis: '',
    typ: 'Bilder',
    kategorie: '',
    kamera: '',
  })

  if (!isBildverwaltung) return null

  const handleAction = (view: string) => {
    setSelectedView(view)
    // Menü bleibt offen
  }

  return (
    <aside className="w-64 bg-gray-100 p-4 overflow-auto">
      {/* Menü-Kopf */}
      <div
        className="cursor-pointer font-bold text-lg mb-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        Menü {menuOpen ? '▴' : '▾'}
      </div>

      {/* Menü-Einträge */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleAction('suche')}
            className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-left"
          >
            Suche
          </button>
          <button
            onClick={() => handleAction('verwaltung')}
            className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-left"
          >
            Verwaltung
          </button>
          <button
            onClick={() => handleAction('browser')}
            className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-left"
          >
            Browser
          </button>
          <button
            onClick={() => handleAction('statistik')}
            className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded text-left"
          >
            Statistik
          </button>
        </div>
      </div>

      {/* Dynamischer Inhalt unter dem Menü */}
      <div className="mt-4">
        {selectedView === 'suche' && (
          <SucheView
            values={sucheValues}
            onChange={setSucheValues}
            onSearch={(values) => {
              setSucheValues(values)
              onSearch(values) // an die Eltern-Komponente weiterreichen
            }}
          />
        )}

        {/* Hier könntest du weitere Views wie 'verwaltung', 'browser' etc. rendern */}
      </div>
    </aside>
  )
}