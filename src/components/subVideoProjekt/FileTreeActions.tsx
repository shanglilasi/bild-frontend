import { useState } from "react";
import { BASE_URL } from '../../config';
import { apiFetch } from "../../util/api";
interface FileTreeActionsProps {
  fullPath: string;
  name: string;
  onActionDone?: () => void;
  onRefresh?: () => void; // 👈 NEU
}

export default function FileTreeActions({ fullPath, name, onActionDone,onRefresh }: FileTreeActionsProps) {
  const [hovered, setHovered] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 777);
  };

  const handleOpenFolder = async () => {
    try {
      const encodedPath = fullPath.replaceAll("/", "|");
      const response = await apiFetch(
        `${BASE_URL}/utils/openFolder/${encodeURIComponent(encodedPath)}`,
        { method: "GET" }
      );
      const result = await response.json();
  
      if (result.success) {
        showMessage("📂 Ordner geöffnet");
      } else {
        showMessage(`❌ Fehler: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      showMessage("❌ Netzwerkfehler beim Öffnen des Ordners");
    }
  };



  const handleDelete = async () => {
    if (confirm(`Möchtest du die Datei "${name}" wirklich löschen?`)) {
      try {
        const encodedPath = fullPath.replaceAll("/", "|");
        const response = await apiFetch(`${BASE_URL}/utils/deletefile/${encodeURIComponent(encodedPath)}`, {
          method: "GET",
        });
        const result = await response.json();
        if (result.success) {
          showMessage("🗑️ Datei gelöscht");
          onActionDone?.();
          onRefresh?.(); // 👈 FileTree neu laden
        } else {
          showMessage(`❌ Fehler: ${result.error}`);
        }
      } catch (err) {
        console.error(err);
        showMessage("❌ Netzwerkfehler beim Löschen");
      }
    }
  };

  const handleRename = async () => {
    const parts = name.split(".");
    const encodedPath = fullPath.replaceAll("/", "|");
    const defaultName = parts.slice(0, -1).join(".") || name;
    const newName = prompt("Neuer Dateiname", defaultName);

    if (newName && newName !== name) {
      try {
        const response = await apiFetch(
          `${BASE_URL}/utils/rename/${encodeURIComponent(encodedPath)}/${encodeURIComponent(newName)}`,
          { method: "GET" }
        );
        const result = await response.json();

        if (result.success) {
          showMessage("✅ Datei umbenannt");
          onActionDone?.();
          onRefresh?.(); // 👈 FileTree neu laden
        } else {
          showMessage(`❌ Fehler: ${result.error}`);
        }
      } catch (err) {
        console.error(err);
        showMessage("❌ Netzwerkfehler beim Umbenennen");
      }
    }
  };

  return (
    <span
      className="ml-auto text-gray-400 hover:text-gray-700 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      ⚙️
      {hovered && (
        <div className="absolute top-full right-0 bg-white border rounded shadow-md p-1 z-50 space-y-1">
            <button
                className="block w-full text-left text-sm hover:bg-gray-100 px-2 py-1"
                onClick={() => {
        navigator.clipboard.writeText(fullPath );
        showMessage("in_Zwischenablage");
      }}>📄 Pfad kopieren</button>
            <button
                className="block w-full text-left text-sm hover:bg-gray-100 px-2 py-1"
                onClick={handleOpenFolder}> 📂Öffnen</button>

<button
  className="block w-full text-left text-sm hover:bg-gray-100 px-2 py-1"
  onClick={async () => {
    try {
      const response = await apiFetch(
        `${BASE_URL}/utils/history?pfad=${encodeURIComponent(fullPath)}`
      );
      const result = await response.json();
      if (Array.isArray(result)) {
        const text = result.map((item, index) =>
          `#${index + 1}: ${JSON.stringify(item, null, 2)}`
        ).join("\n\n");
        alert("🕓 Historie:\n\n" + text);
      } else {
        alert("⚠️ Keine Historie gefunden oder Fehler beim Abruf.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Fehler beim Abrufen der Historie.");
    }
  }}
>
  🕓 Historie
</button>






            <button className="block w-full text-left text-sm hover:bg-gray-100 px-2 py-1" 
                onClick={handleRename}> 🔄Umbenennen</button>
          <button className="block w-full text-left text-sm hover:bg-red-100 text-red-700 px-2 py-1" 
                onClick={handleDelete}>
              🗑️Löschen</button>







        </div>
      )}

      {/* ✅ Flashmeldung */}
      {message && (
        <div className="absolute -bottom-6 right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow z-20">
          {message}
        </div>
      )}
    </span>
  );
}