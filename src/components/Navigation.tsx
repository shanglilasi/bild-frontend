
//components/Navigation.tsx
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/StoreContext'

export default function Navigation() {
  const location = useLocation()
  const { suchStore } = useStore()

  const handleNavClick = (view: string) => {
    suchStore.setMainView(view)
  }

  const navLinks = [
    { to: '/bilder', label: 'Bilder', view: 'bilder' },
    { to: '/abfragen', label: 'Verwalten', view: 'verwaltung' },
  ]

  return (
    <nav className="bg-gray-200 px-4 py-2 flex gap-2">
      {navLinks.map(({ to, label, view }) => (
        <Link
          key={to}
          to={to}
          onClick={() => handleNavClick(view)}
          className={`px-3 py-1 rounded text-sm font-medium 
            ${location.pathname === to
              ? 'bg-gray-400 text-white'
              : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}