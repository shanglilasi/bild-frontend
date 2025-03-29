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
    onSearch: (values: Props['values']) => void
  }
  
  export default function SucheView({ values, onChange, onSearch }: Props) {
    return (
      <form
        className="space-y-2 text-sm"
        onSubmit={(e) => {
          e.preventDefault()
          onSearch(values)
        }}
      >
        <input
          type="text"
          value={values.text}
          placeholder="Suchtext"
          className="w-full border rounded px-2 py-1"
          onChange={(e) => onChange({ ...values, text: e.target.value })}
        />
  
        <div className="flex gap-2">
          <input
            type="date"
            value={values.von}
            className="border rounded px-2 py-1 w-full"
            onChange={(e) => onChange({ ...values, von: e.target.value })}
          />
          <input
            type="date"
            value={values.bis}
            className="border rounded px-2 py-1 w-full"
            onChange={(e) => onChange({ ...values, bis: e.target.value })}
          />
        </div>
  
        <select
          value={values.typ}
          onChange={(e) => onChange({ ...values, typ: e.target.value })}
          className="w-full border rounded px-2 py-1"
        >
          <option>Bilder</option>
          <option>Videos</option>
        </select>
  
        <select
          value={values.kategorie}
          onChange={(e) => onChange({ ...values, kategorie: e.target.value })}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Kategorie wählen</option>
          <option value="Natur">Natur</option>
          <option value="Technik">Technik</option>
        </select>
  
        <select
          value={values.kamera}
          onChange={(e) => onChange({ ...values, kamera: e.target.value })}
          className="w-full border rounded px-2 py-1"
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