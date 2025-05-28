import { useState } from "react";

//src/components/subVideoProjekt/FileSelectorModal.tsx
interface Props {
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function FileSelectorModal({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = async () => {
    const res = await fetch(`/api/sucheDatei?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.files || []);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow max-w-lg w-full">
        <h3 className="text-lg font-bold mb-2">📁 Datei suchen</h3>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-full mb-2"
          placeholder="Suchbegriff eingeben..."
        />

        <button onClick={handleSearch} className="bg-blue-600 text-white px-3 py-1 rounded mb-2">
          🔍 Suchen
        </button>

        <div className="max-h-64 overflow-y-auto border rounded p-2 text-sm">
          {results.map((file, idx) => (
            <div
              key={idx}
              onClick={() => onSelect(file)}
              className="cursor-pointer hover:bg-blue-100 p-1 border-b"
            >
              {file}
            </div>
          ))}
        </div>

        <div className="text-right mt-4">
          <button onClick={onClose} className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}