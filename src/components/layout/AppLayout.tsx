import { Outlet } from 'react-router-dom'
import Navigation from '../Navigation'
import Sidebar from '../Sidebar' 

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar /> {/* <-- Sidebar-Komponente hier eingefügt */}
        {/* Hauptbereich */}
        <main className="flex-1 bg-white p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}