import { Link, useLocation } from 'react-router-dom'

export default function Navigation() {
  const location = useLocation()

  const navLinks = [
    { to: '/bilder', label: 'Bildverwaltung' },
    { to: '/abfragen', label: 'Abfragen' },
  ]

  return (
    <nav className="bg-gray-200 px-4 py-2 flex gap-2">
      {navLinks.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
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