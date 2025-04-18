import { Combobox } from '@headlessui/react'
import { useEffect, useState } from 'react'

type Kategorie = {
  id: number
  name: string
}

export default function KategorieCombobox({
  kategorien,
  selected,
  onChange,
}: {
  kategorien: Kategorie[]
  selected: string
  onChange: (value: string) => void
}) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // debounce the query input (200ms)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query)
    }, 200)
    return () => clearTimeout(timeout)
  }, [query])

  const filtered =
    debouncedQuery === ''
      ? kategorien.slice(0, 50) // Max 50 bei leerer Eingabe
      : kategorien
          .filter((kat) =>
            kat.name.toLowerCase().includes(debouncedQuery.toLowerCase())
          )
          .slice(0, 50) // Max 50 auch bei Suche

  return (
    <Combobox value={selected} onChange={onChange}>
      <div className="relative">
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(val: string) =>
            kategorien.find((k) => k.id.toString() === val)?.name || ''
          }
          className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white placeholder-white"
          placeholder="Kategorie wählen"
        />
        <Combobox.Options className="absolute z-10 w-full mt-1 bg-white rounded shadow-lg max-h-60 overflow-auto text-sm">
          {filtered.length === 0 && (
            <div className="px-4 py-2 text-gray-500">Keine Treffer</div>
          )}
          {filtered.map((kat) => (
            <Combobox.Option
              key={kat.id}
              value={kat.id.toString()}
              className={({ active }) =>
                `px-4 py-2 cursor-pointer ${
                  active ? 'bg-blue-500 text-white' : 'text-gray-900'
                }`
              }
            >
              {kat.name}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  )
}