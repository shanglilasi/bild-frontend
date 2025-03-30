import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import suchStore from '../store/SuchStore'
import SucheView from '../views/SucheView'

const Sidebar: React.FC = observer(() => {
  const { setView, view } = suchStore

  const [sucheValues, setSucheValues] = useState({
    text: '',
    von: '',
    bis: '',
    typ: 'Bilder',
    kategorie: '',
    kamera: '',
  })

  const handleSearch = () => {
    suchStore.search(sucheValues)
  }

  return (
    <div className="w-60 bg-gray-900 text-white p-4 space-y-4 overflow-y-auto">
      <div className="space-y-2">
        <button
          className={`w-full p-2 rounded ${
            view === 'suche' ? 'bg-blue-700' : 'bg-gray-700'
          }`}
          onClick={() => setView('suche')}
        >
          Suche
        </button>
        <button
          className={`w-full p-2 rounded ${
            view === 'browser' ? 'bg-blue-700' : 'bg-gray-700'
          }`}
          onClick={() => setView('browser')}
        >
          Browser
        </button>
      </div>

      {view === 'suche' && (
        <SucheView
          values={sucheValues}
          onChange={setSucheValues}
          onSearch={handleSearch}
        />
      )}
    </div>
  )
})

export default Sidebar