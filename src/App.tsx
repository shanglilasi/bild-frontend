import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import BildVerwaltungPage from './pages/BildVerwaltungPage'
import DatenbankAbfragePage from './pages/DatenbankAbfragePage'




function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/bilder" />} />
        <Route path="/bilder" element={<BildVerwaltungPage />} />
        <Route path="/abfragen" element={<DatenbankAbfragePage />} />
      </Route>
    </Routes>
  )
}

export default App