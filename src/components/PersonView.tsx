import { useState, useEffect } from "react"
import { BASE_URL } from '../config';
type Person = {
  id: number
  name: string
  birthDate?: string
  gender?: string
  bio?: string
  father?: { id: number; name: string }
  mother?: { id: number; name: string }
  partners?: {
    id: number
    name: string
    description?: string
    children?: { id: number; name: string }[]
  }[]
}

type Props = {
  initialPersonId: number
}

type FormData = Person & {
  fatherId?: number | ""
  motherId?: number | ""
}

export default function PersonView({ initialPersonId }: Props) {
  const [personData, setPersonData] = useState<Person | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [allPersons, setAllPersons] = useState<Person[]>([])

  useEffect(() => {
    fetch(`${BASE_URL}/ahnen/person/${initialPersonId}`)
      .then(res => res.json())
      .then((data: Person) => {
        setPersonData(data)
        setFormData({
          ...data,
          fatherId: data.father?.id || "",
          motherId: data.mother?.id || ""
        })
      })

    fetch(`${BASE_URL}/ahnen/person`)
      .then(res => res.json())
      .then((data: Person[]) => setAllPersons(data))
  }, [initialPersonId])

  const handleSave = () => {
    if (!formData) return

    const { fatherId, motherId, ...rest } = formData
    const payload = {
      ...rest,
      father: fatherId ? { id: fatherId } : null,
      mother: motherId ? { id: motherId } : null
    }

    fetch(`${BASE_URL}/ahnen/person/${initialPersonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then((updated: Person) => {
        setPersonData(updated)
        setEditMode(false)
      })
  }

  if (!personData || !formData) return <div>Lade...</div>

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {editMode ? (
            <input
              className="border px-2 py-1"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          ) : (
            personData.name
          )}
        </h2>
        <button onClick={() => setEditMode(!editMode)} className="bg-gray-200 px-3 py-1 rounded">
          {editMode ? "Abbrechen" : "Bearbeiten"}
        </button>
      </div>
Gagagagagagagag
      {editMode ? (
        <>
          <div className="space-y-2">
            <label>Geburtsdatum:
              <input
                className="block border px-2 py-1 w-full"
                value={formData.birthDate || ""}
                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </label>

            <label>Geschlecht:
              <select
                className="block border px-2 py-1 w-full"
                value={formData.gender || ""}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="m">männlich</option>
                <option value="w">weiblich</option>
                <option value="d">divers</option>
              </select>
            </label>

            <label>Vater:
              <select
                className="block border px-2 py-1 w-full"
                value={formData.fatherId || ""}
                onChange={e => setFormData({ ...formData, fatherId: parseInt(e.target.value) || "" })}
              >
                <option value="">(unbekannt)</option>
                {allPersons.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>

            <label>Mutter:
              <select
                className="block border px-2 py-1 w-full"
                value={formData.motherId || ""}
                onChange={e => setFormData({ ...formData, motherId: parseInt(e.target.value) || "" })}
              >
                <option value="">(unbekannt)</option>
                {allPersons.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>Beschreibung:</label>
            <textarea
              className="w-full border rounded px-2 py-1 min-h-[150px]"
              value={formData.bio || ""}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <button onClick={handleSave} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Speichern
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div><strong>Geboren:</strong> {personData.birthDate}</div>
          <div><strong>Geschlecht:</strong> {
            personData.gender === "m" ? "männlich" :
            personData.gender === "w" ? "weiblich" : "divers"
          }</div>
          <div><strong>Vater:</strong> {personData.father?.name || "(unbekannt)"}</div>
          <div><strong>Mutter:</strong> {personData.mother?.name || "(unbekannt)"}</div>

          <div>
            <h3 className="font-semibold mt-4">Beschreibung:</h3>
            <div className="whitespace-pre-line bg-gray-100 p-2 rounded border text-sm">
              {personData.bio || "—"}
            </div>
          </div>

          {Array.isArray(personData.partners) && personData.partners.length > 0 && (
            <div>
              <h3 className="font-semibold mt-4">Partner und Kinder:</h3>
              {personData.partners.map((partner) => (
                <div key={partner.id} className="mb-4">
                  <div><strong>Partner:</strong> {partner.name}</div>
                  <div><em>{partner.description}</em></div>

                  {Array.isArray(partner.children) && partner.children.length > 0 && (
                    <div className="ml-4 mt-1">
                      <strong>Kinder:</strong>
                      <ul className="list-disc list-inside">
                        {partner.children.map(child => (
                          <li key={child.id}>{child.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}