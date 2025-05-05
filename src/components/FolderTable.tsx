//components/FolderTable.tsx
import React, { useEffect, useState } from "react"
import KategorieCombobox from "./KategorieCombobox"
import { useStore } from "../store/StoreContext"
import { observer } from "mobx-react-lite"
import { BASE_URL } from '../config';

interface Folder {
  NR: number
  PFAD: string
  EINLESEDATUM: string | null
  Anz: number
}

interface ReadResult {
  path_id: number
  category: number
  successful: any[]
  errors: any[]
}

const FolderTable: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedKategorieId, setSelectedKategorieId] = useState<string>("0") // Standardwert 0
  const [readResult, setReadResult] = useState<ReadResult | null>(null)
  const [readError, setReadError] = useState<string | null>(null)

  const { kategorieStore } = useStore()

  useEffect(() => {
    kategorieStore.loadKategorien()

    fetch(`${BASE_URL}/utils/folder`)
      .then((res) => res.json())
      .then((data: Folder[]) => setFolders(data))
      .catch((error) => console.error("Fehler beim Laden der Ordner:", error))
  }, [kategorieStore])

  const handleEinlesen = async (folderNr: number) => {
    try {
      const response = await fetch(
        `${BASE_URL}/utils/read/${folderNr}?kategorie=${selectedKategorieId || "0"}`, // Fallback auf 0
        { method: "GET" }
      )

      if (!response.ok) {
        throw new Error(`Fehler beim Einlesen (Status ${response.status})`)
      }

      const result: ReadResult = await response.json()
      console.log("Erfolgreich eingelesen:", result)

      setReadResult(result)
      setReadError(null)
    } catch (error: any) {
      console.error("Fehler beim Einlesen:", error)
      setReadError(error.message || "Unbekannter Fehler")
      setReadResult(null)
    }
  }

  // Fehler gruppieren nach Typ
  function gruppiereFehler(errors: any[]) {
    const grouped: { [errorType: string]: string[] } = {}

    errors.forEach((err) => {
      if (typeof err === "string") {
        grouped["Allgemeiner Fehler"] = grouped["Allgemeiner Fehler"] || []
        grouped["Allgemeiner Fehler"].push(err)
      } else if (err && typeof err === "object") {
        const errorText = err.error || "Unbekannter Fehler"
        grouped[errorText] = grouped[errorText] || []
        grouped[errorText].push(err.file || "Unbekannte Datei")
      }
    })

    return grouped
  }

  return (
    <div className="p-1 bg-white">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">
          Bilder direkt einer Kategorie zuordnen:
        </h3>
        <p>Wenn die Kategorie noch nicht angelegt wurde, mach dies in Bilder/Kategorie.</p>

        {/* Combobox mit Store-Kategorien */}
        <KategorieCombobox
          kategorien={kategorieStore.kategorien}
          selected={selectedKategorieId}
          onChange={(value: string) => setSelectedKategorieId(value)}
        />

        {/* Erfolgreiche Einleseergebnisse */}
        {readResult && (
          <div className="p-4 mb-4 rounded bg-green-100 text-green-800">
            <h4 className="font-bold mb-2">Einlesen erfolgreich:</h4>

            {/* Erfolgstabelle */}
            {readResult.successful.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-green-300 rounded-md shadow-sm text-sm text-left">
                  <thead className="bg-green-200">
                    <tr>
                      <th className="px-4 py-2 border">Dateiname</th>
                      <th className="px-4 py-2 border">Größe (Bytes)</th>
                      <th className="px-4 py-2 border">Aufnahmedatum</th>
                      <th className="px-4 py-2 border">Kamera</th>
                      <th className="px-4 py-2 border">Fotograf</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-300">
                    {readResult.successful
                      .filter((img) => img !== null)
                      .map((img, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 border">{img.filename || "—"}</td>
                          <td className="px-4 py-2 border">{img.size ?? "—"}</td>
                          <td className="px-4 py-2 border">{img.date_taken || "—"}</td>
                          <td className="px-4 py-2 border">{img.camera || "—"}</td>
                          <td className="px-4 py-2 border">{img.photographer || "—"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>Keine neuen Bilder eingelesen.</p>
            )}

            {/* Fehlerliste */}
            {readResult.errors.length > 0 && (
              <div className="mt-4 p-3 rounded bg-red-100 text-red-800">
                <h5 className="font-semibold mb-2">Fehler beim Einlesen:</h5>

                {Object.entries(gruppiereFehler(readResult.errors)).map(
                  ([errorType, files], idx) => (
                    <div key={idx} className="mb-3">
                      <div className="font-bold">{errorType}</div>
                      <ul className="list-disc list-inside ml-4">
                        {files.map((file, fileIdx) => (
                          <li key={fileIdx}>{file}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Fehleranzeige bei Fetch */}
        {readError && (
          <div className="p-4 mb-4 rounded bg-red-100 text-red-800">
            <h4 className="font-bold mb-2">Fehler beim Einlesen</h4>
            <p>{readError}</p>
          </div>
        )}

        {/* Tabelle aller Ordner */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md shadow-sm text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Ordner</th>
                <th className="px-4 py-2 border">Zuletzt eingelesen</th>
                <th className="px-4 py-2 border">Bilder</th>
                <th className="px-4 py-2 border">Einlesen</th>
                <th className="px-4 py-2 border">Hochladen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {folders.map((folder) => (
                <tr key={folder.NR} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-blue-600 text-left">
                    <a
                      href={`bilder/bildsuche?suche=${folder.NR}&modus=pfad&von=0&anz=100`}
                      className="hover:underline"
                    >
                      {folder.PFAD}
                    </a>
                  </td>
                  <td className="px-4 py-2 border">{folder.EINLESEDATUM ?? "—"}</td>
                  <td className="px-4 py-2 border">{folder.Anz}</td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleEinlesen(folder.NR)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Einlesen
                    </button>
                  </td>
                  <td className="px-4 py-2 border">
                    <a
                      href={`${BASE_URL}/utils/folderup/${folder.NR}`}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition inline-block"
                    >
                      Upload in diesen Ordner
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default observer(FolderTable)