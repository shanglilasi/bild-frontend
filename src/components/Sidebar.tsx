// src/components/Sidebar.tsx

import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'
import SucheView from '../views/SucheView'

const Sidebar: React.FC = observer(() => {
  const { suchStore } = useStore()
  const { setView, view } = suchStore

  const [sucheValues, setSucheValues] = useState({
    text: '',
    von: '1900-01-01',
    bis: new Date().toISOString().split('T')[0],
    typ: '',
    kategorie: '',
    kamera: '',
    fotograf:'',
    noKategorie: false,
    noTitle: false,
  })

  const handleSearch = () => {
    const mindestens3Zeichen = sucheValues.text.trim().length >= 3
    const kategorieVorhanden = !!sucheValues.kategorie && sucheValues.kategorie !== ''
  
    if (!mindestens3Zeichen && !kategorieVorhanden && !sucheValues.noKategorie && !sucheValues.noTitle) {
      alert("Bitte mindestens 3 Zeichen im Suchtext eingeben oder eine Kategorie wählen.")
      return
    }
  
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