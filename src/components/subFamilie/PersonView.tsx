//src/components/subFamilie/PersonView.tsx
import { useState, useEffect } from "react"
import { BASE_URL } from '../../config'
import PersonElement from './PersonElement'
import KategorieCombobox from '../subBilder/KategorieCombobox'
import { useStore } from '../../store/StoreContext'
import { apiFetch } from "../../util/api"
import BilderZuPerson from "./BilderZuPerson"
import PersonLinks from "./PersonLinks"
type Person = {
  id: number
  name: string
  vorname: string
  birthDate?: string
  birthPlace?: string
  birthName?: string
  deathDate?: string
  deathPlace?: string
  categoryId?: number
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
  const [moeglicheVaeter, setMoeglicheVaeter] = useState<{ id: number; name: string }[]>([])
  const [moeglicheMuetter, setMoeglicheMuetter] = useState<{ id: number; name: string }[]>([])
  //const [moeglicheKategorie, setMoeglicheKategorie] = useState<{ id: number}[]>([])
  const { kategorieStore } = useStore()
  useEffect(() => {
    apiFetch(`${BASE_URL}/ahnen/person/${initialPersonId}`)
      .then(res => res.json())
      .then((data: Person) => {
        setPersonData(data)
        setFormData({
          ...data,
          fatherId: data.father?.id || "",
          motherId: data.mother?.id || ""
        })

        // Lade mögliche Eltern, sobald die Daten da sind
        apiFetch(`${BASE_URL}/ahnen/eltern/${data.id}/m`)
          .then(res => res.json())
          .then(setMoeglicheVaeter)

        apiFetch(`${BASE_URL}/ahnen/eltern/${data.id}/w`)
          .then(res => res.json())
          .then(setMoeglicheMuetter)
      })
  }, [initialPersonId])

  
const handleSave = () => {
  if (!formData) return

  const { fatherId, motherId, ...rest } = formData

  const payload = {
    ...rest,
    father: fatherId ? { id: fatherId } : null,
    mother: motherId ? { id: motherId } : null
  }

  apiFetch(`${BASE_URL}/ahnen/savePerson`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("Fehler beim Speichern")
      return res.json()
    })
    .then(data => {
      console.log("Erfolg:", data)
      setEditMode(false)
      // Optional: Daten neu laden
    })
    .catch(err => {
      console.error("Speichern fehlgeschlagen:", err)
      // Optional: Fehlermeldung anzeigen
    })
}



  if (!personData || !formData) return <div>Lade...</div>

  return (
    <div className="p-4 space-y-4 text-black">
      <div className="flex justify-between items-center">
   
        <button onClick={() => setEditMode(!editMode)} className="bg-gray-200 px-3 py-1 rounded">
          {editMode ? "Abbrechen" : "Bearbeiten"}
        </button>
      </div>
   <PersonLinks id={formData.id}/>



      {editMode ? (
        <>  
        <table><tbody>
          <tr><td>Vorname</td><td>
        
        <input
              className="border px-2 py-1"
              value={formData.vorname}
              onChange={e => setFormData({ ...formData, vorname: e.target.value })}
            /> </td></tr>
         <tr><td>Name</td><td><input
              className="border px-2 py-1"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            /></td></tr>
        <tr><td>Geburtsdatum</td><td><input
                className="block border px-2 py-1 w-full"
                value={formData.birthDate || ""}
                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
              /></td></tr>
             <tr><td>Geschlecht</td><td>  <select
                 className="border px-2 py-1 flex-1"
                value={formData.gender || ""}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="m">männlich</option>
                <option value="w">weiblich</option>
                <option value="d">divers</option>
              </select></td></tr>
            
         <tr><td>Geburtsort</td><td><input
                className="border px-2 py-1 flex-1"
                value={formData.birthPlace || ""}
                onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
              /></td></tr>
        <tr><td>Geburtsname</td><td><input
                className="border px-2 py-1 flex-1"
                value={formData.birthName || ""}
                onChange={e => setFormData({ ...formData, birthName: e.target.value })}
              /></td></tr>
            <tr><td>Sterbedatum</td><td> <input
                className="border px-2 py-1 flex-1"
                value={formData.deathDate || ""}
                onChange={e => setFormData({ ...formData, deathDate: e.target.value })}
              /></td></tr>
           <tr><td>Sterbeort</td><td><input
                className="border px-2 py-1 flex-1"
                value={formData.deathPlace || ""}
                onChange={e => setFormData({ ...formData, deathPlace: e.target.value })}
              /></td></tr>


              
<tr><td>Bildkategorie</td><td>
<KategorieCombobox

  kategorien={kategorieStore.kategorien}
  selected={formData.categoryId?.toString() ?? ''}
  onChange={(id: string) =>
    setFormData({ ...formData, categoryId: parseInt(id) })
  }
/>
</td></tr>



              <tr><td></td><td></td></tr>
<tr><td>Vater</td><td><select
                  className="border px-2 py-1 flex-1"
                  value={formData.fatherId || ""}
                  onChange={e => setFormData({ ...formData, fatherId: parseInt(e.target.value) || "" })}
                >
                  <option value="">(unbekannt)</option>
                  {moeglicheVaeter.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select></td></tr>

<tr><td>Mutter</td><td><select
                   className="border px-2 py-1 flex-1"
                  value={formData.motherId || ""}
                  onChange={e => setFormData({ ...formData, motherId: parseInt(e.target.value) || "" })}
                >
                  <option value="">(unbekannt)</option>
                  {moeglicheMuetter.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select></td></tr>
</tbody>
       </table>

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
          
          <div className="flex gap-4">

            <div>
              <strong>Vater:</strong>{" "}
              {personData.father ? (
                <PersonElement id={personData.father.id} name={personData.father.name} />
              ) : "(unbekannt)"}
            </div>
            <div>
              <strong>Mutter:</strong>{" "}
              {personData.mother ? (
                <PersonElement id={personData.mother.id} name={personData.mother.name} />
              ) : "(unbekannt)"}
            </div>
          </div>
          
        <h2 className="text-xl font-bold">
 {personData.vorname} {personData.name}
</h2>

<p className="text-sm leading-relaxed">
  {(() => {
    const parts: string[] = []

    if (personData.birthDate) {
      parts.push(`geboren am ${personData.birthDate}`)
    }

    if (personData.birthPlace) {
      parts.push(`in ${personData.birthPlace}`)
    }

    if (parts.length > 0) parts[parts.length - 1] += "."

    const deathParts: string[] = []
    if (personData.deathDate) {
      deathParts.push(`Gestorben am ${personData.deathDate}`)
    }
    if (personData.deathPlace) {
      deathParts.push(`in ${personData.deathPlace}`)
    }
    if (deathParts.length > 0) deathParts[deathParts.length - 1] += "."

    const birthName = personData.birthName ? `Geburtsname: ${personData.birthName}.` : ""
    
    return [parts.join(" "), deathParts.join(" "), birthName]
      .filter(Boolean)
      .join(" ")
  })()}
</p>

          <div>
            <h3 className="font-semibold mt-4">Beschreibung:</h3>
            <div
              className="whitespace-pre-line bg-gray-100 p-2 rounded border text-sm"
              dangerouslySetInnerHTML={{ __html: personData.bio || "—" }}
            />
          </div>

          {Array.isArray(personData.partners) && personData.partners.length > 0 && (
            <div>
              
              {personData.partners.map((partner) => (
                <div key={partner.id} className="mb-4">
                  <div>
                    <strong>Partner:</strong>{" "}
                    <PersonElement id={partner.id} name={partner.name} />
                  </div>
                  <div><em>{partner.description}</em></div>

                  {Array.isArray(partner.children) && partner.children.length > 0 && (
                    <div className="ml-4 mt-1">
                      <strong>Kinder:</strong>
                      <ul className="list-disc list-inside">
                        {partner.children.map(child => (
                          <li key={child.id}>
                            <PersonElement id={child.id} name={child.name} />
                          </li>
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

{!editMode && (
  <div>
    <h3 className="font-bold mt-6 mb-2">Bilder dieser Person</h3>
    <BilderZuPerson categoryId={personData.categoryId} max={3} />
  </div>
)}



    </div>





  )





  
}
