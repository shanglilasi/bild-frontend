import { BASE_URL } from "../../config";
import { useEffect, useRef, useState } from "react";
import FileItem from "./FileItem"; // falls ausgelagert, sonst inline

interface Props {
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function FileSelectorModal({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);
  const [probeInfo, setProbeInfo] = useState<any>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null!); 
  const handleSearch = async () => {
    const res = await fetch(`${BASE_URL}/utils/sucheDatei?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.files || []);
  };

  useEffect(() => {
    if (!hoveredFile) return;

    const fetchProbe = async () => {
      try {
        const res = await fetch(`${BASE_URL}/utils/videodata?path=${encodeURIComponent(hoveredFile)}`);
        const data = await res.json();
        setProbeInfo(data);
      } catch (err) {
        setProbeInfo({ error: "Fehler beim Laden" });
      }
    };

    fetchProbe();
  }, [hoveredFile]);

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

        <div
          className="max-h-64 overflow-y-auto border rounded p-2 text-sm"
          ref={scrollContainerRef}
        >
          {results.map((file) => (
            <FileItem
              key={file}
              file={file}
              isHovered={hoveredFile === file}
              probeInfo={probeInfo}
              onHover={setHoveredFile}
              onSetProbeInfo={setProbeInfo}
              onSelect={onSelect}
              scrollContainerRef={scrollContainerRef}
            />
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