// src/components/layout/AppLayout.tsx

import { Outlet } from 'react-router-dom'
import Navigation from '../Navigation'
import Sidebar from '../Sidebar'
import BrowserView from '../../views/BrowserView'

import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useStore } from '../../store/StoreContext'

const AppLayout = observer(() => {
  const { suchStore } = useStore()

  useEffect(() => {
    console.log("View:", suchStore.view)
    console.log("Results:", suchStore.results)
  }, [suchStore.view, suchStore.results])

  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 bg-white p-4 overflow-auto space-y-4">
        <Outlet />
        {suchStore.view === "browser" && <BrowserView />}
        </main>
      </div>
    </div>
  )
})

export default AppLayout