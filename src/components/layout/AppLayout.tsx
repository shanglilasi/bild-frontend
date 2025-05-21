// src/components/layout/AppLayout.tsx

import { Outlet } from 'react-router-dom'
import Navigation from '../Navigation'
import Sidebar from '../Sidebar'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Menu } from 'lucide-react'

const AppLayout = observer(() => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
          <div id="global-overlay-root" />
          <Outlet />
        </main>
      </div>
    </div>
  )
})

export default AppLayout