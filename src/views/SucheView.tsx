interface Props {
    values: {
      text: string
      von: string
      bis: string
      typ: string
      kategorie: string
      kamera: string
    }
    onChange: (newValues: Props['values']) => void
    onSearch: () => void
  }
  
  export default function SucheView({ values, onChange, onSearch }: Props) {
    return (
      <form
        className="space-y-2 text-sm"
        onSubmit={(e) => {
          e.preventDefault()
          onSearch()
        }}
      >
        <input
          type="text"
          placeholder="Suchtext"
          value={values.text}
          onChange={(e) => onChange({ ...values, text: e.target.value })}
          className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white placeholder-white"

        />
  
        <div className="flex gap-2">
          <input
            type="date"
            value={values.von}
            onChange={(e) => onChange({ ...values, von: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
          <input
            type="date"
            value={values.bis}
            onChange={(e) => onChange({ ...values, bis: e.target.value })}
            className="border rounded px-2 py-1 w-full"
          />
        </div>
  
        <select
          value={values.typ}
          onChange={(e) => onChange({ ...values, typ: e.target.value })}
          className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"

        >
          <option>Bilder</option>
          <option>Videos</option>
        </select>
  
        <select
          value={values.kategorie}
          onChange={(e) => onChange({ ...values, kategorie: e.target.value })}
          className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"

        >
          <option value="">Kategorie wählen</option>
          <option value="Natur">Natur</option>
          <option value="Technik">Technik</option>
          <option value="Dynamisch">..dynamisch aus Tabelle</option>
        </select>
  
        <select
          value={values.kamera}
          onChange={(e) => onChange({ ...values, kamera: e.target.value })}
          className="w-full border border-gray-600 rounded px-2 py-1 bg-gray-800 text-white"

        >
          <option value="">Kamera wählen</option>
          <option value="Canon">Canon</option>
          <option value="Nikon">Nikon</option>
        </select>
  
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        >
          Suchen
        </button>
      </form>
    )
  }