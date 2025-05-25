// src/views/PersonViewWrapper.tsx

import { useParams } from 'react-router-dom'
import PersonView from '../components/subFamilie/PersonView'

export default function PersonViewWrapper() {
  const { id } = useParams<{ id: string }>()
  const parsedId = Number(id)

  if (!id || isNaN(parsedId)) return <div>Ungültige ID</div>

  return <PersonView initialPersonId={parsedId} />
}