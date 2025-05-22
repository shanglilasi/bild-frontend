// src/components/PersonElement.tsx
import { useNavigate } from "react-router-dom"

type Props = {
  id: number
  name: string
  className?: string
}

export default function PersonElement({ id, name, className = "" }: Props) {
  const navigate = useNavigate()

  const [displayName, birthDate] = name.split(",").map(s => s.trim())

  return (
    <button
      onClick={() => navigate(`/ahnen/person/${id}`)}
      className={`text-left ${className} hover:bg-blue-100 p-2 rounded transition`}
    >
      <div className="text-blue-700 font-medium">{displayName}</div>
      {birthDate && (
        <div className="text-xs italic text-gray-500">{birthDate}</div>
      )}
    </button>
  )
}