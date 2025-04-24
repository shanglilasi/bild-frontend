import { useEffect, useState } from "react"
import { Bot, Loader2 } from "lucide-react"

export default function LlmInfo({ bildNr }: { bildNr: number }) {
  const [info, setInfo] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLLM = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5001/api/holeLLM/${bildNr}`)
        const text = await res.text()
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

  if (!info) {
    return <div className="text-sm text-gray-500 mt-2">Keine Analyse verfügbar.</div>
  }

  return (
    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded text-sm space-y-1">
      <div className="font-semibold mb-1 text-yellow-800 flex items-center gap-1">
        <Bot className="w-4 h-4" /> LLM-Bildanalyse
      </div>
      <div className="whitespace-pre-wrap">{info}</div>
    </div>
  )
}