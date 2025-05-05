import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activationCode, setActivationCode] = useState('');
  const [activationResult, setActivationResult] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('password', password);

    try {
      const response = await fetch(`${BASE_URL}/login/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || 'Registrierung fehlgeschlagen.');
      }
    } catch (err) {
      setError('Serverfehler bei der Registrierung.');
    }
  };

  const handleActivation = async () => {
    setActivationResult(null);
    try {
      const res = await fetch(`${BASE_URL}/login/activate?code=${encodeURIComponent(activationCode)}`, {
        method: 'GET',
      });
      const data = await res.json();
      setActivationResult(data.message || data.error);

      if (res.ok) {
        // Automatisch zur Login-Seite nach 2 Sekunden
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setActivationResult('Fehler bei der Aktivierung.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-center">📝 Registrierung</h2>

      <form onSubmit={handleRegister} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Registrieren
        </button>
      </form>

      {message && <p className="text-green-700 text-sm">{message}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Aktivierungsbereich nach erfolgreicher Registrierung */}
      {message?.includes('Aktivierungslink') && (
        <div className="mt-6 border-t pt-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">📩 Aktivierungscode eingeben</h3>
          <input
            type="text"
            placeholder="Aktivierungscode aus der E-Mail"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleActivation}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Konto aktivieren
          </button>
          {activationResult && (
            <p className="text-sm mt-2 text-gray-800">{activationResult}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterForm;