//components/FolderTable.tsx
import React, { useEffect, useState } from "react"
import KategorieCombobox from "./KategorieCombobox"
import { useStore } from "../store/StoreContext"
import { observer } from "mobx-react-lite"


const BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface Folder {
  NR: number
  PFAD: string
  EINLESEDATUM: string | null
  Anz: number
}

const FolderTable: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedKategorieId, setSelectedKategorieId] = useState<string>("")

  const { kategorieStore } = useStore()
 
  useEffect(() => {
    kategorieStore.loadKategorien()

    fetch(`${BASE_URL}/utils/folder`)
      .then((res) => res.json())
      .then((data: Folder[]) => setFolders(data))
      .catch((error) => console.error("Fehler beim Laden der Ordner:", error))
  }, [kategorieStore])

  return (
    <div className="p-6">
      <form encType="multipart/form-data" className="space-y-4">
        <h3 className="text-lg font-semibold">
          Bilder direkt einer Kategorie zuordnen:
        </h3>
Wenn die Kategorie noch nicht angelegt wurde, mach dies in Bilder/Kategorie
        {/* Combobox mit Store-Kategorien */}
        <KategorieCombobox
          kategorien={kategorieStore.kategorien}
          selected={selectedKategorieId}
          onChange={(value: string) => setSelectedKategorieId(value)}
        />

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
                    <form
                      action={`/utils/read/${folder.NR}?kategorie=${selectedKategorieId}`}
                      method="get"
                    >
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                      >
                        Einlesen
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-2 border">
                    <a
                      href={`/utils/folderup/${folder.NR}`}
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
      </form>
    </div>
  )
}

export default observer(FolderTable)