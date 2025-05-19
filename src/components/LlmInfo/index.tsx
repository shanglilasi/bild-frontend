import { useEffect, useState } from "react"
import { Bot, Loader2 } from "lucide-react"
import { BASE_URL } from '../../config'

export default function LlmInfo({ bildNr }: { bildNr: number }) {
  const [info, setInfo] = useState<{ stichworte: { id: number, wort: string }[] }>({ stichworte: [] })
  const [fragen, setFragen] = useState<{ id: number, frage: string }[]>([])
  const [selectedFrage, setSelectedFrage] = useState<number | null>(null)
  const [antwort, setAntwort] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const [showNewFrage, setShowNewFrage] = useState(false)
  const [neueFrage, setNeueFrage] = useState("")  

// oben in der Komponente
  const loadLLM = async () => {
  setLoading(true)
  try {
    const res = await fetch(`${BASE_URL}/llm/holeLLM/${bildNr}`)
    const data = await res.json()
    setInfo(data)
  } catch (err) {
    console.error("Fehler beim Laden der LLM-Analyse:", err)
  } finally {
    setLoading(false)
  }
}


useEffect(() => {
  loadLLM()
}, [bildNr])

  useEffect(() => {
    setAntwort(null)
  }, [bildNr])

  const loadFragen = async () => {
    try {
      const res = await fetch(`${BASE_URL}/llm/alleFragen`)
      const data = await res.json()
      setFragen(data)
      if (data.length > 0) setSelectedFrage(data[0].id)
    } catch (err) {
      console.error("Fehler beim Laden der Fragen:", err)
    }
  }


  // Lade Fragen für das Select-Menü
  useEffect(() => {
    loadFragen()
  }, [])

  const handleFrageAbsenden = async () => {
    if (!selectedFrage) return
    setSending(true)
    try {
      const res = await fetch(`${BASE_URL}/llm/frageLLM?bild_id=${bildNr}&frage_id=${selectedFrage}`)
      const data = await res.json()
      setAntwort(data?.antwort || "Keine Antwort erhalten.")
      await loadLLM()
    } catch (err) {
      console.error("Fehler bei der Anfrage an das LLM:", err)
      setAntwort("Fehler bei der Anfrage.")
    } finally {
      setSending(false)
    }
  }
  



  const handleDelete = async (krId: number) => {
    console.log("Lösche kr.id:", krId)
    try {
      const res = await fetch(`${BASE_URL}/llm/delKeyword/${krId}`, {
        method: 'DELETE',
      })
      const result = await res.json()
      console.log("Lösch-Ergebnis:", result)
  
      if (res.ok) {
        await loadLLM()
      } else {
        console.error("Fehler beim Löschen des Stichworts")
      }
    } catch (err) {
      console.error("Netzwerkfehler beim Löschen:", err)
    }
  }









  if (loading) {
    return (
      <div className="flex items-center text-sm text-gray-500 gap-2 mt-2">
        <Loader2 className="animate-spin w-4 h-4" /> Analyse wird geladen...
      </div>
    )
  }

  return (
    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm space-y-3">
      <div className="font-semibold text-yellow-800 flex items-center gap-1">
        <Bot className="w-4 h-4" /> LLM-Bildanalyse
      </div>

      <div className="flex flex-wrap gap-2">
        {info.stichworte.map(({ id, wort }) => (
          <div
            key={id}
            className="flex items-center bg-gray-200 rounded-full px-1 py-1 text-xs"
          >
            <span>{wort}</span>
            <button
              onClick={() => handleDelete(id)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
      
      <div className="flex items-center gap-2">
          <label className="block mb-1 text-sm font-medium">Frage auswählen:</label>
          <select
            className="w-full border border-gray-300 rounded p-1"
            value={selectedFrage ?? ''}
            onChange={(e) => setSelectedFrage(parseInt(e.target.value))}
          >
            {fragen.map(f => (
              <option key={f.id} value={f.id}>{f.frage}</option>
            ))}
          </select>
          <button
    className="text-blue-600 text-xl font-bold px-2 hover:text-blue-800"
    onClick={() => setShowNewFrage(true)}
    title="Neue Frage hinzufügen"
  >
    +
  </button>
  {showNewFrage && (
  <div className="mt-2 p-2 bg-white border border-blue-300 rounded shadow text-sm space-y-2">
    <div className="font-medium text-blue-700">Neue Frage hinzufügen</div>
    <input
      type="text"
      className="w-full border border-gray-300 rounded p-1"
      value={neueFrage}
      onChange={(e) => setNeueFrage(e.target.value)}
      placeholder="Frage eingeben..."
    />
    <div className="flex gap-2">
      <button
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={async () => {
          try {
            const res = await fetch(`${BASE_URL}/llm/addFrage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ frage: neueFrage }),
            })

            if (res.ok) {
              setNeueFrage("")
              setShowNewFrage(false)
              await loadFragen()  // ⬅️ Lade Select-Optionen neu
            } else {
              console.error("Fehler beim Hinzufügen der Frage")
            }
          } catch (err) {
            console.error("Netzwerkfehler beim Hinzufügen der Frage", err)
          }
        }}
      >
        Speichern
      </button>
      <button
        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={() => setShowNewFrage(false)}
      >
        Abbrechen
      </button>
    </div>
  </div>
)}
        </div>

        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleFrageAbsenden}
          disabled={sending || !selectedFrage}
        >
          {sending ? "Frage wird gesendet..." : "Frage LLM"}
        </button>

        {antwort && (
          <div className="mt-2 p-2 bg-white border rounded text-gray-800">
            <div className="font-medium mb-1">Antwort:</div>
            <div>{antwort}</div>
          </div>
        )}






      </div>
    </div>
  )
}