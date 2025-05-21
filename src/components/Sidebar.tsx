// src/components/Sidebar.tsx

import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'
import SucheView from '../views/SucheView'
import KategorieFormSmart from './KategorieFormSmart'
import FamilienSuche from './FamilienSuche'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = observer(({ isOpen = false, onClose = () => {} }) => {
  const { suchStore } = useStore()
  const { view, verwaltungTab, setVerwaltungTab, setView } = suchStore
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

  // ============ Hauptinhalt für Ansicht "bilder" ============
  const renderBilderSidebar = () => (
    <>
      <div className="space-y-2">
        <button
          className={`w-full p-2 rounded ${view === 'suche' ? 'bg-blue-700' : 'bg-gray-700'}`}
          onClick={() => setView('suche')}
        >
          Suche
        </button>

        <button
          className="w-full p-2 bg-gray-700 rounded hover:bg-blue-600"
          onClick={() => navigate('/browser')}
        >
          Browser
        </button>

        <button
          className="w-full p-2 bg-gray-700 rounded hover:bg-blue-600"
          onClick={() => setShowKategorieForm(prev => !prev)}
        >
          Kategorie
        </button>
      </div>

      {view === 'suche' && (
        <SucheView values={sucheValues} onChange={setSucheValues} onSearch={handleSearch} />
      )}

      {showKategorieForm && (
        <div className="mt-4">
          <KategorieFormSmart />
        </div>
      )}
    </>
  )

  // ============ Verwaltung ============
  const renderVerwaltungSidebar = () => (
    <div className="space-y-2">
      {['ordner', 'bilder', 'videoeditor', 'reports'].map((tab) => (
        <button
          key={tab}
          className={`w-full p-2 rounded ${verwaltungTab === tab ? 'bg-blue-700' : 'bg-gray-700'}`}
          onClick={() => setVerwaltungTab(tab as any)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  )

  // ============ Familie ============
  const renderFamilienSidebar = () => (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {/* Mobile Close Button */}
      <div className="md:hidden text-right">
        <button onClick={onClose} className="text-white text-2xl font-bold">&times;</button>
      </div>
      <FamilienSuche />
    </div>
  )

  const sidebarContent = (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {/* Mobile Close Button */}
      <div className="md:hidden text-right">
        <button onClick={onClose} className="text-white text-2xl font-bold">&times;</button>
      </div>

      {location.pathname.startsWith('/bilder') && renderBilderSidebar()}
      {location.pathname.startsWith('/abfragen') && renderVerwaltungSidebar()}
    </div>
  )

if (location.pathname.startsWith('/ahnen')) {
  return (
    <div className={`${baseClasses} ${translateClass}`}>
      <div className="p-4 space-y-4 overflow-y-auto h-full">
        <div className="md:hidden text-right">
          <button onClick={onClose} className="text-white text-2xl font-bold">&times;</button>
        </div>
        <FamilienSuche />
      </div>
    </div>
  )
}

  return (
    <div className={`${baseClasses} ${translateClass}`}>
      {sidebarContent}
    </div>
  )
})

export default Sidebar