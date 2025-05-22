// src/components/Sidebar.tsx

import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'
import SucheView from '../views/SucheView'
import KategorieFormSmart from './KategorieFormSmart'
import FamilienSuche from './FamilienSuche'
import { useNavigate, useLocation } from 'react-router-dom'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = observer(({ isOpen = false, onClose = () => {} }) => {
  const { suchStore } = useStore()
  const { verwaltungTab, setVerwaltungTab } = suchStore
  const navigate = useNavigate()
  const location = useLocation()

  const [showKategorieForm, setShowKategorieForm] = useState(false)

  const [sucheValues, setSucheValues] = useState({
    text: '',
    von: '1900-01-01',
    bis: new Date().toISOString().split('T')[0],
    typ: '',
    kategorie: '',
    kamera: '',
    fotograf: '',
    noKategorie: false,
    noTitle: false,
  })

  const handleSearch = () => {
    const mindestens3Zeichen = sucheValues.text.trim().length >= 3
    const kategorieVorhanden = !!sucheValues.kategorie

    if (!mindestens3Zeichen && !kategorieVorhanden && !sucheValues.noKategorie && !sucheValues.noTitle) {
      alert("Bitte mindestens 3 Zeichen im Suchtext eingeben oder eine Kategorie wählen.")
      return
    }

    suchStore.search(sucheValues)
  }

  const baseClasses = `fixed z-50 inset-y-0 left-0 bg-gray-900 text-white w-60 transform transition-transform duration-300 md:relative md:translate-x-0`
  const translateClass = isOpen ? 'translate-x-0' : '-translate-x-full'

  const isPath = (path: string) => location.pathname === path

  const sidebarContent = (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <div className="md:hidden text-right">
        <button onClick={onClose} className="text-white text-2xl font-bold">&times;</button>
      </div>

      {isPath('/bilder') && (
        <>
          <div className="space-y-2">
            <button
              className="w-full p-2 bg-gray-700 rounded hover:bg-blue-600"
              onClick={handleSearch}
            >
              Suche ausführen
            </button>

            <button
              className="w-full p-2 bg-gray-700 rounded hover:bg-blue-600"
              onClick={() => navigate('/browser')}
            >
              Browser
            </button>

            <button
              className="w-full p-2 bg-gray-700 rounded hover:bg-blue-600"
              onClick={() => setShowKategorieForm((prev) => !prev)}
            >
              Kategorie
            </button>
          </div>

          <SucheView
            values={sucheValues}
            onChange={setSucheValues}
            onSearch={handleSearch}
          />

          {showKategorieForm && (
            <div className="mt-4">
              <KategorieFormSmart />
            </div>
          )}
        </>
      )}

      {isPath('/abfragen') && (
        <div className="space-y-2">
          <button
            className={`w-full p-2 rounded ${verwaltungTab === 'ordner' ? 'bg-blue-700' : 'bg-gray-700'}`}
            onClick={() => setVerwaltungTab('ordner')}
          >
            Ordner
          </button>
          <button
            className={`w-full p-2 rounded ${verwaltungTab === 'bilder' ? 'bg-blue-700' : 'bg-gray-700'}`}
            onClick={() => setVerwaltungTab('bilder')}
          >
            Bilder
          </button>
          <button
            className={`w-full p-2 rounded ${verwaltungTab === 'videoeditor' ? 'bg-blue-700' : 'bg-gray-700'}`}
            onClick={() => setVerwaltungTab('videoeditor')}
          >
            Videoeditor
          </button>
          <button
            className={`w-full p-2 rounded ${verwaltungTab === 'reports' ? 'bg-blue-700' : 'bg-gray-700'}`}
            onClick={() => setVerwaltungTab('reports')}
          >
            Reports
          </button>
        </div>
      )}

      {isPath('/ahnen') && (
        <FamilienSuche />
      )}
    </div>
  )

  return (
    <div className={`${baseClasses} ${translateClass}`}>
      {sidebarContent}
    </div>
  )
})

export default Sidebar