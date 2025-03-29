import { useState } from 'react'
import PIC from '../components/PIC'

interface Props {
  results: any[] // später typisieren
}

export default function SuchErgebnisseView({ results }: Props) {
  const [page, setPage] = useState(1)
  const pageSize = 10

  const paginated = results.slice((page - 1) * pageSize, page * pageSize)
  const pageCount = Math.ceil(results.length / pageSize)

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {paginated.map((bild, i) => (
          <PIC key={i} data={bild} />
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}