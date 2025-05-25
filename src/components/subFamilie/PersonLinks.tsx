// src/components/subFamilie/PersonLinks.tsx


type Props = {
  id: number
}

export default function PersonLinks({ id }: Props) {
  return (
    <div className="flex gap-2 text-xl mt-2" title="Verwandtschaftsfunktionen">
      <a
        href={`http://localhost:5001/datenexport/${id}`}
        target="_blank"
        title="Datenexport für diese Person"
        rel="noopener noreferrer"
      >
        🌍
      </a>
      <a
        href={`http://localhost:5001/r_nachkommentab/${id}`}
        target="_blank"
        title="Nachkommen als breite Tabelle"
        rel="noopener noreferrer"
      >
        ⚆
      </a>
      <a
        href={`http://localhost:5001/nachkommen/${id}`}
        target="_blank"
        title="Nachkommen als eingerückte Liste"
        rel="noopener noreferrer"
      >
        ✷
      </a>
      <a
        href={`http://localhost:5001/vorfahren/${id}`}
        target="_blank"
        title="Vorfahren horizontal"
        rel="noopener noreferrer"
      >
        ❉
      </a>
    </div>
  )
}