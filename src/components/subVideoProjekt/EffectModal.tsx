import { COLOR_EFFECTS } from "./constants";




interface EffektModalProps {
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function EffektModal({ onSelect, onClose }: EffektModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow max-w-lg w-full">
        <h3 className="text-lg font-bold mb-2">🎨 Effekt auswählen</h3>

        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto text-sm">
          {COLOR_EFFECTS.map((eff, i) => (
            <div
              key={i}
              onClick={() => onSelect(eff.value)}
              className="p-2 border rounded hover:bg-blue-100 cursor-pointer"
            >
              <div className="font-mono text-xs mb-1">{eff.value}</div>
              <div>{eff.label}</div>
            </div>
          ))}
        </div>

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}