
type NodeOption = {
  type: string
  label: string
  description: string
}






const NODE_OPTIONS: NodeOption[] = [
  {
    type: 'add',
    label: '➕ Add',
    description: 'Summiert zwei Eingänge.',
  },
  {
    type: 'slide',
    label: '🎚️ Slider',
    description: 'Erzeugt einen Zahlenwert.',
  },
  {
    type: 'if',
    label: '🔀 If',
    description: 'Gibt je nach Bedingung ein Ergebnis zurück.',
  },
  {
    type: 'concat',
    label: '🔗 Concat',
    description: 'Verbindet Strings von mehreren Eingängen.',
  },
  {
  type: 'max',
  label: '⬆ Max',
  description: 'Gibt den größeren der beiden Eingänge aus.',
}
]

export default function NodeTypeSelectorModal({
  onSelect,
  onClose,
}: {
  onSelect: (type: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div
        className="bg-white rounded shadow-lg p-4 w-[400px] max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Node-Typ auswählen</h2>
        <div className="space-y-3">
          {NODE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => onSelect(opt.type)}
              className="w-full text-left border rounded p-2 hover:bg-blue-100"
            >
              <div className="font-semibold">{opt.label}</div>
              <div className="text-sm text-gray-600">{opt.description}</div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 rounded p-2"
        >
          Abbrechen
        </button>
      </div>
    </div>
  )
}