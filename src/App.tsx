// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import BildVerwaltungPage from './pages/BildVerwaltungPage'
import DatenbankAbfragePage from './pages/DatenbankAbfragePage'
import KategorieManagerView from './views/KategorieManagerView'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import RegisterForm from './components/RegisterForm' 
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/bilder" />} />
        <Route path="/bilder" element={<BildVerwaltungPage />} />
        <Route path="/abfragen" element={<DatenbankAbfragePage />} />
        <Route path="/kategorien" element={<KategorieManagerView />} />
        
      </Route>
    </Routes>
  )
}

export default App