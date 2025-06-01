// src/App.tsx


import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import BildVerwaltungPage from './pages/BildVerwaltungPage'
import DatenbankAbfragePage from './pages/DatenbankAbfragePage'
import KategorieManagerView from './views/KategorieManagerView'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import RegisterForm from './components/RegisterForm'
import FamilienView from './views/FamilienView'
import PersonViewWrapper from './views/PersonViewWrapper'
import BrowserView from './views/BrowserView'


import NodeEditorWrapper from './components/Node/NodeEditorWrapper'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterForm />} />
<Route path="/nodes" element={<NodeEditorWrapper />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/bilder" />} />
        <Route path="/bilder" element={<BildVerwaltungPage />} />
        <Route path="/browser" element={<BrowserView />} />
        <Route path="/abfragen" element={<DatenbankAbfragePage />} />
        <Route path="/kategorien" element={<KategorieManagerView />} />
        <Route path="/ahnen" element={<FamilienView />}>
        <Route path="/ahnen/person/:id" element={<PersonViewWrapper />} />
</Route>
 
      </Route>
    </Routes>
  )
}

export default App