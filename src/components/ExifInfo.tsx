import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function ExifInfo({ bildNr }: { bildNr: number }) {
  const [exif, setExif] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExif = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5001/api/holeExif/${bildNr}`)
        const data = await res.json()
        setExif(data)
      } catch (err) {
        console.error("Fehler beim Laden der EXIF-Daten:", err)
      } finally {
        setLoading(false)
      }
    }

    loadExif()
  }, [bildNr])

  if (loading) {
    return (
      <div className="flex items-center text-sm text-gray-500 gap-2 mt-2">
        <Loader2 className="animate-spin w-4 h-4" /> Lade EXIF-Daten...
      </div>
    )
  }

  if (!exif ) {
    return <div className="text-sm text-gray-500 mt-2">Keine EXIF-Daten vorhanden.</div>
  }

  return (
    <div className="mt-2 p-3 bg-gray-100 border rounded text-sm space-y-1">
      <div className="font-semibold mb-1 text-gray-700">📸 EXIF-Daten</div>
      {Object.entries(exif).map(([key, val]) => (
        <div key={key}>
          <span className="font-medium">{key}:</span> {String(val)}
        </div>
      ))}
    </div>
  )
}