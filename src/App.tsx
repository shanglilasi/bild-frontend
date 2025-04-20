import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import BildVerwaltungPage from './pages/BildVerwaltungPage'
import DatenbankAbfragePage from './pages/DatenbankAbfragePage'

import KategorieManagerView from './views/KategorieManagerView'




function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/bilder" />} />
        <Route path="/bilder" element={<BildVerwaltungPage />} />
        <Route path="/abfragen" element={<DatenbankAbfragePage />} />
        <Route path="/kategorien" element={<KategorieManagerView />} />
      </Route>
    </Routes>
  )
}

export default App