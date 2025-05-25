// components/LoginPage.tsx
import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../config';
import { apiFetch } from "../util/api"
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { authStore } = useStore()
  const navigate = useNavigate()


  const handleLogin = async () => {
  setErrorMsg(null)
  if (!email || !password) {
    setErrorMsg('Bitte gültige Anmeldedaten eingeben.')
    return
  }

  try {
    const response = await apiFetch(`${BASE_URL}/login/checklogin`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      authStore.login(data.user)
      navigate('/bilder')
    } else {
      setErrorMsg(data.error || 'Login fehlgeschlagen.')
    }
  } catch (error) {
    setErrorMsg('Serverfehler beim Login.')
  }
}







  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow space-y-4 border">
      <h2 className="text-2xl font-bold text-center">🔐 Anmeldung</h2>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Anmelden
      </button>
      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

      <p className="text-sm text-center mt-4">
  Noch kein Konto?{' '}
  <Link to="/register" className="text-blue-600 hover:underline">
    Jetzt registrieren
  </Link>
</p>


      
    </div>
  )
}