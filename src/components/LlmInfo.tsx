//components/LlmInfo.tsx

import { useEffect, useState } from "react"
import { Bot, Loader2 } from "lucide-react"
import { BASE_URL } from '../config';

export default function LlmInfo({ bildNr }: { bildNr: number }) {
  const [info, setInfo] = useState<{ stichworte: string[] }>({ stichworte: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLLM = async () => {
      try {
        const res = await fetch(`${BASE_URL}/llm/holeLLM/${bildNr}`)
        const text = await res.json()
        setInfo(text)
      } catch (err) {
        console.error("Fehler beim Laden der LLM-Analyse:", err)
      } finally {
        setLoading(false)
      }
    }

    loadLLM()
  }, [bildNr])

  if (loading) {
    return (
      <div className="flex items-center text-sm text-gray-500 gap-2 mt-2">
        <Loader2 className="animate-spin w-4 h-4" /> Analyse wird geladen...
      </div>
    )
  }

  if (!info.stichworte.length) {
    return <div className="text-sm text-gray-500 mt-2">Keine Analyse verfügbar.</div>
  }

  return (
    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm space-y-1">
      <div className="font-semibold mb-1 text-yellow-800 flex items-center gap-1">
        <Bot className="w-4 h-4" /> LLM-Bildanalyse
      </div>
      <div className="whitespace-pre-wrap">
        {info.stichworte.map((wort, index) => (
          <div key={index}>{wort}</div>
        ))}
      </div>
    </div>
  )
}