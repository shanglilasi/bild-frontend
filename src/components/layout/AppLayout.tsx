import { Outlet } from 'react-router-dom'
import Navigation from '../Navigation'
import Sidebar from '../Sidebar'
import suchStore from '../../store/SuchStore'
import BrowserView from '../../views/BrowserView'
import SucheView from '../../views/SucheView'

import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'

const AppLayout = observer(() => {
  useEffect(() => {
    suchStore.loadTestdaten()
  }, [])

  const { view } = suchStore

  // Zustand für das Suchformular
  const [sucheValues, setSucheValues] = useState({
    text: '',
    von: '',
    bis: '',
    typ: 'Bilder',
    kategorie: '',
    kamera: '',
  })

  // Wenn auf "Suchen" geklickt wird
  const handleSearch = () => {
    // Hier könntest du z. B. suchStore.search(sucheValues) aufrufen
    // Oder vorerst nur Testdaten laden:
    suchStore.loadTestdaten()
  }

  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-white p-4 overflow-auto">
          {view === 'browser' && <BrowserView />}
          {view === 'browser' && <BrowserView />}
          {view === null && <Outlet />}
                 </main>
      </div>
    </div>
  )
})

export default AppLayout