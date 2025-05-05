// src/components/layout/AppLayout.tsx

import { Outlet } from 'react-router-dom'
import Navigation from '../Navigation'
import Sidebar from '../Sidebar'
import BrowserView from '../../views/BrowserView'


import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useStore } from '../../store/StoreContext'

// imports ergänzen
import { useState } from 'react'
import { Menu } from 'lucide-react'

const AppLayout = observer(() => {
  const { suchStore } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(false) // ⬅️ Zustand für Sidebar

  useEffect(() => {
    console.log("View:", suchStore.view)
    console.log("Results:", suchStore.results)
  }, [suchStore.view, suchStore.results])

  return (
    <div className="flex flex-col h-screen">
      <Navigation />

      {/* Hamburger Button nur auf Mobile */}
      <div className="md:hidden p-2 bg-gray-100">
        <button onClick={() => setSidebarOpen(true)} className="p-2">
          <Menu />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 bg-black p-4 overflow-auto space-y-4">
  {suchStore.view === 'browser' ? (
    <BrowserView />
  ) : (
    <Outlet />
  )}
</main>


      </div>
    </div>
  )
})

export default AppLayout