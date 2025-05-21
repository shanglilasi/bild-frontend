
//components/Navigation.tsx
import { Link, useLocation } from 'react-router-dom'
import { useStore } from '../store/StoreContext'

export default function Navigation() {
  const location = useLocation()
  const { suchStore, authStore } = useStore()

  const handleNavClick = (view: string) => {
    suchStore.setMainView(view)
  }

  const navLinks = [
    { to: '/bilder', label: 'Bilder', view: 'bilder' },
    { to: '/abfragen', label: 'Verwalten', view: 'verwaltung' },
    { to: '/ahnen', label: 'Familie', view: 'Familie' },
  ]

  return (
    <nav className="bg-black px-4 py-2 flex gap-2 items-center">
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

      {/* Rechts: Login/Logout-Button */}
      <div className="ml-auto flex items-center gap-2">
        {authStore.isAuthenticated ? (
          <button
            onClick={authStore.logout}
            className="bg-gray-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Logoff {authStore.username}
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}