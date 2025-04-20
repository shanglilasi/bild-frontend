// src/components/Sidebar.tsx

import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'
import SucheView from '../views/SucheView'
import KategorieForm from './KategorieForm'

const Sidebar: React.FC = observer(() => {
  const { suchStore, kategorieStore } = useStore()
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

  const [showKategorieForm, setShowKategorieForm] = useState(false)

  const handleSearch = () => {
    const mindestens3Zeichen = sucheValues.text.trim().length >= 3
    const kategorieVorhanden = !!sucheValues.kategorie && sucheValues.kategorie !== ''
  
    if (!mindestens3Zeichen && !kategorieVorhanden && !sucheValues.noKategorie && !sucheValues.noTitle) {
      alert("Bitte mindestens 3 Zeichen im Suchtext eingeben oder eine Kategorie wählen.")
      return
    }
  
    suchStore.search(sucheValues)
  }

  const kategorien = kategorieStore?.kategorien || []


  const handleKategorieSubmit = async (data: {
    NR: number
    BEZEICHNUNG: string
    KATTYP: string
    OBER: number | null
    BESCHREIBUNG: string
    hidden: number
  }) => {
    try {
      const response = await fetch('http://localhost:5001/api/kategorien', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  
      const result = await response.json()
  
      if (!response.ok) {
        alert(`Fehler beim Speichern: ${result.error || 'Unbekannter Fehler'}`)
        return
      }
  
      // ✅ Kategorie-Liste vollständig neu laden
      await kategorieStore.loadKategorien()
  
      // ✅ Formular ausblenden
      setShowKategorieForm(false)
    } catch (error) {
      console.error('Fehler beim Speichern der Kategorie:', error)
      alert('Ein Fehler ist beim Speichern aufgetreten.')
    }
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
        <button
          className="w-full p-2 bg-gray-700 rounded hover:bg-blue-600"
          onClick={() => setShowKategorieForm((prev) => !prev)}
        >
          Kategorie
        </button>
      </div>

      {view === 'suche' && (
        <SucheView
          values={sucheValues}
          onChange={setSucheValues}
          onSearch={handleSearch}
        />
      )}

      {showKategorieForm && (
        <div className="mt-4">
          <KategorieForm
  kategorien={kategorien}
  onSave={(data, isUpdate) => {
    if (isUpdate) {
      // PUT
      fetch(`http://localhost:5001/api/kategorien/${data.NR}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res.error) {
            alert(`Fehler: ${res.error}`)
            return
          }
          await kategorieStore.loadKategorien()
          setShowKategorieForm(false)
        })
        .catch(() => alert("Fehler beim Update"))
    } else {
      // POST
      fetch('http://localhost:5001/api/kategorien', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res.error) {
            alert(`Fehler: ${res.error}`)
            return
          }
          await kategorieStore.loadKategorien()
          setShowKategorieForm(false)
        })
        .catch(() => alert("Fehler beim Speichern"))
    }
  }}
  onSearch={(filter) => {
    console.log("Suche nicht implementiert in Sidebar:", filter)
  }}
/>
        </div>
      )}
    </div>
  )
})

export default Sidebar