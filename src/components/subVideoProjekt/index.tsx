// components/VideoProjekt/index.tsx

import { useEffect, useRef, useState } from "react";
import FileTree from "./FileTree";
import VideoActionButtons from "./VideoActionButtons";
import { getDisplayUrlFromFullPath, formatTime } from "./helper";
import {
  fetchRelatedFiles,
  loadMarks,
  //saveMarks,
  
} from "./service";
import { EditableMark, FileEntry, VideoProjektProps, SchnittmarkenVariante } from "./types";
import { BASE_URL } from '../../config';
import { apiFetch } from "../../util/api";

const COLOR_EFFECTS = [
  { value: "null", label: "Kein Effekt" },
  { value: "hue=s=0", label: "Sättigung = 0 (Schwarzweiß)" },
  { value: "eq=contrast=1.5", label: "Erhöhter Kontrast" },
  { value: "eq=brightness=0.1", label: "Helligkeit leicht erhöht" },
  { value: "eq=brightness=-0.1", label: "Helligkeit leicht gesenkt" },
  { value: "format=yuv420p,colorbalance=bs=0.3", label: "Blau verstärkt" },
  { value: "format=yuv420p,colorbalance=rs=0.3", label: "Rot verstärkt" },
  { value: "format=yuv420p,colorbalance=gs=0.3", label: "Grün verstärkt" },
  { value: "curves=preset=strong_contrast", label: "Starker Kontrast (Kurven)" },
  { value: "curves=preset=color_negative", label: "Farbnegativ" },
  { value: "hue=h=90", label: "Farbton verschoben (90°)" },
  { value: "hue=s=2", label: "Sättigung verdoppelt" },
  { value: "hue=s=0.5", label: "Sättigung halbiert" },
  { value: "format=yuv420p,colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3", label: "Mischung RGB-Kanäle" },
  { value: "format=yuv420p,lutyuv='u=128:v=128'", label: "UV-Kanäle neutralisiert" },
  { value: "eq=saturation=2.0", label: "Sättigung x2" }
];




export default function VideoProjekt({ bildNr }: VideoProjektProps) {
  const [relatedFiles, setRelatedFiles] = useState<FileEntry[]>([]);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedFileFullPath, setSelectedFileFullPath] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<"image" | "audio" |"video" | null>(null);
  const [marks, setMarks] = useState<EditableMark[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isWorking, setIsWorking] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [markenVarianten, setMarkenVarianten] = useState<SchnittmarkenVariante[]>([]);
  const [selectedMarkenId, setSelectedMarkenId] = useState<number | null>(null);
  const [variantName, setVariantName] = useState("");
  const [copied, setCopied] = useState(false);
  const [modalOpenIdx, setModalOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    fetchRelatedFiles(String(bildNr)).then(setRelatedFiles);
  }, [bildNr]);

  const handleSelectFile = (fullPath: string) => {
    const url = getDisplayUrlFromFullPath(fullPath);
    if (!url) return;

    const ext = url.split(".").pop()?.toLowerCase();
    if (["mp4","m4v", "mov", "avi", "mpg"].includes(ext || "")) {
      setSelectedFileType("video");
    } else if (["mp3", "m4a", "wav", "ogg"].includes(ext || "")) {
      setSelectedFileType("audio");
    } else if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) {
      setSelectedFileType("image");
    } else {
      setSelectedFileType(null);
    }

    setSelectedFileUrl(url);
    setSelectedFileFullPath(fullPath);
    setMarks([]);
  };



  useEffect(() => {
    if (!selectedFileFullPath || selectedFileType !== "video") return;
  
    const loadAktiveMarken = async () => {
      const result = await loadMarks(selectedFileFullPath);
      if (result && Array.isArray(result.data)) {
        setMarks(result.data);
        setVariantName(result.name);
        setSelectedMarkenId(result.id);
      } else {
        setMarks([]);  // ← leer setzen, wenn ungültig
      }
    };
  
    loadAktiveMarken();
  }, [selectedFileFullPath, selectedFileType]);



  useEffect(() => {
    if (!selectedFileFullPath || selectedFileType !== "video") return;
  
    const loadVarianten = async () => {
      try {
        const encodedPath = encodeURIComponent(selectedFileFullPath.replaceAll("/", "|"));
        const res = await apiFetch(`${BASE_URL}/utils/schnittmarken_proj/${bildNr}/${encodedPath}`);
        if (!res.ok) throw new Error("Serverantwort war nicht OK");
        const data = await res.json();
        setMarkenVarianten(data);
        if (data.length > 0) setSelectedMarkenId(data[0].id);
      } catch (err) {
        console.error("Fehler beim Laden der Varianten:", err);
      }
    };
  
    loadVarianten();
  }, [selectedFileFullPath, selectedFileType]);


  const handleVideoAction = async (
    endpoint: string,
    params: Record<string, string | number | boolean>
  ) => {
    setIsWorking(true);
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await apiFetch(`${BASE_URL}/utils/${endpoint}?${query}`);
      const data = await res.json();
      console.log(data);
      await reloadFileTree(); // <
      alert(`✅ Aktion '${endpoint}' erfolgreich ausgeführt.`);
    } catch (err) {
      console.error(err);
      alert(`❌ Fehler bei Aktion '${endpoint}'`);
    } finally {
      setIsWorking(false);
    }
  };

  const reloadFileTree = async () => {
    const files = await fetchRelatedFiles(String(bildNr));
    setRelatedFiles(files);
  };

  const addMark = () => {
    const newMark: EditableMark = {
      time: currentTime,
      comment: "",
      size: "medium",
      color: "#000000",
      background: "#ffffff",
    };
    setMarks((prev) => [...prev, newMark].sort((a, b) => a.time - b.time));
  };

  const updateMark = (index: number, updates: Partial<EditableMark>) => {
    setMarks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated.sort((a, b) => a.time - b.time);
    });
  };

  const deleteMark = (index: number) => {
    setMarks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveMarks = async () => {
    if (!selectedFileFullPath) return;
  
    try {
      const encoded = encodeURIComponent(selectedFileFullPath.replaceAll("/", "|"));
      const res = await apiFetch(`${BASE_URL}/utils/marks/${bildNr}/${encoded}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marks,
          name: variantName.trim(),
          
        }),
      });
  
      if (!res.ok) throw new Error("Fehler beim Speichern.");
      alert("Marken gespeichert.");
    } catch (err) {
      console.error(err);
      alert("Fehler beim Speichern.");
    }
  };

  const handleCloneVariant = async (id: number) => {
    try {
      const res = await apiFetch(`${BASE_URL}/utils/schnittmarken/${id}`);
      if (!res.ok) throw new Error("Variante konnte nicht geladen werden");
      const data = await res.json();
  
      if (data?.data) {
        setMarks(data.data);
        setVariantName(data.name); // optional: auch den Namen übernehmen
      }
    } catch (err) {
      console.error("Fehler beim Clonen:", err);
      alert("Fehler beim Laden der Variante.");
    }
  };


  return (
    <div className="flex gap-6">
      {/* LEFT SIDE */}
      <div className="w-1/3 flex flex-col gap-4">
        {/* FileTree Container */}
        <div className="max-h-[600px] overflow-auto p-4 bg-white rounded shadow">
          <h3 className="text-lg font-bold mb-4">
          🧬Ableger des Videos
            <button
              onClick={reloadFileTree}
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-sm px-2 py-1 rounded"
            >
              🔄
            </button>
          </h3>
          <div className="space-y-2">
            {relatedFiles.map((entry, idx) => (
              <FileTree
                key={idx}
                entry={entry}
                onSelect={handleSelectFile}
                onRefresh={reloadFileTree} // 👈 HIER
                selectedPath={selectedFileFullPath ?? undefined}
              />
            ))}
          </div>
        </div>



        {/* Action Buttons BELOW FileTree */}
        {selectedFileFullPath && selectedFileType === "video" && (
  <VideoActionButtons
    selectedFileFullPath={selectedFileFullPath}
    isWorking={isWorking}
    currentTime={currentTime}
    handleVideoAction={handleVideoAction}
  />
)}
      </div>
      {/* RIGHT SIDE */}
      <div className="w-2/3 p-4 bg-gray-50 rounded shadow flex flex-col items-center justify-center min-h-[300px]">
        {selectedFileUrl ? (

          selectedFileType === "audio" ? (
            <audio
              controls
              src={selectedFileUrl}
              className="w-full mt-4"
            >
              Dein Browser unterstützt das Audioformat nicht.
            </audio>
          ) :

          selectedFileType === "video" ? (
            <div className="w-full flex flex-col items-center">
              <video
                ref={videoRef}
                src={selectedFileUrl}
                controls
                autoPlay
                className="max-w-full max-h-[500px] rounded"
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              />

              <div className="flex gap-2 mt-4 flex-wrap justify-center">
                <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 1)} className="px-3 py-1 bg-gray-500 text-white rounded">⏪ -1s</button>
                <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 0.1)} className="px-3 py-1 bg-gray-500 text-white rounded">⏪ -0.1s</button>
                <button onClick={() => videoRef.current && (videoRef.current.currentTime += 0.1)} className="px-3 py-1 bg-gray-500 text-white rounded">⏩ +0.1s</button>
                <button onClick={() => videoRef.current && (videoRef.current.currentTime += 1)} className="px-3 py-1 bg-gray-500 text-white rounded">⏩ +1s</button>
                <button onClick={addMark} className="bg-blue-600 text-white px-2 py-1 rounded">+ Marke</button>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <p>⏱ Aktuelle Position: {formatTime(currentTime)}</p>
              </div>
              {selectedFileFullPath && (
  <div className="mt-2 text-xs text-gray-500 text-center break-words">
    <span
      onClick={() => {
        navigator.clipboard.writeText(selectedFileFullPath || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="cursor-pointer hover:text-gray-700 transition"
      title="Klicken zum Kopieren"
    >
      Pfad: {selectedFileFullPath}
    </span>
    {copied && <div className="text-green-600 mt-1">✅ Kopiert!</div>}
  </div>
)}

              <div className="w-full mt-6">

              <div className="mb-2 flex items-center gap-2">
  <label className="text-sm font-medium text-gray-700">Aktionsskripte im Projekt:</label>
  <select
  value={selectedMarkenId ?? ''}
  onChange={(e) => {
    const id = Number(e.target.value);
    setSelectedMarkenId(id);
    if (id) {
      handleCloneVariant(id);
    }
  }}
  className="border px-2 py-1 rounded text-sm"
>
    <option value="">-- auswählen --</option>
    {markenVarianten.map((v) => (
      <option key={v.id} value={v.id}>
        {v.name} {v.is_active ? '⭐' : ''}
      </option>
    ))}
  </select>
</div>


                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold">Aktion speichern!</h4>
                  <input
    type="text"
    placeholder="neues Aktionsskript "
    value={variantName}
    onChange={(e) => setVariantName(e.target.value)}
    className="flex-1 border px-2 py-1 rounded text-sm"
  />
                  <button onClick={handleSaveMarks} className="bg-green-600 text-white px-2 py-1 rounded">💾</button>
                  <div className="mt-3 text-sm text-gray-700">
                <p>🧠 Für die Bereinigung des Videos markiere alle erwünschten Zeiten mit einem Leerzeichen als Kommentar.</p>
              </div>
           
                </div>

                <table className="w-full text-sm table-auto border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-1">⏱ Zeit</th>
                      <th className="p-1">💬 Kommentar</th>
                    
                      <th className="p-1">🔠 Größe</th>
                      <th className="p-1">🎨 Farbe</th>
                      <th className="p-1">🖌 Hintergrund</th>
                      <th className="p-1">🗑</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark, idx) => (
                      <tr key={idx} className="hover:bg-gray-100">
                        <td className="p-1 cursor-pointer text-blue-700" onClick={() => videoRef.current && (videoRef.current.currentTime = mark.time)}>
                          {formatTime(mark.time)}
                        </td>
                     
                        <td className="p-1 flex items-center gap-1">
                          <input
                            type="text"
                            value={mark.comment}
                            onChange={(e) => updateMark(idx, { comment: e.target.value })}
                            className="border px-1 w-full"
                          />
                          <button
                            onClick={() => setModalOpenIdx(idx)}
                            title="Effekt einfügen"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            🎛
                          </button>
                        </td>


                        <td className="p-1">
                          <select value={mark.size || "medium"} onChange={e => updateMark(idx, { size: e.target.value })} className="border px-1 w-full">
                            <option value="small">Klein</option>
                            <option value="medium">Mittel</option>
                            <option value="large">Groß</option>
                          </select>
                        </td>
                        <td className="p-1">
                          <input type="color" value={mark.color || "#000000"} onChange={e => updateMark(idx, { color: e.target.value })} />
                        </td>
                        <td className="p-1">
                          <input type="color" value={mark.background || "#ffffff"} onChange={e => updateMark(idx, { background: e.target.value })} />
                        </td>
                        <td className="p-1 text-center">
                          <button onClick={() => deleteMark(idx)} className="text-red-500">✖</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <img src={selectedFileUrl} alt="Vorschau" className="max-w-full max-h-[500px] rounded" />
          )
        ) : (
          <div className="text-gray-400">Keine Datei ausgewählt</div>
        )}

{modalOpenIdx !== null && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded shadow max-w-lg w-full">
      <h3 className="text-lg font-bold mb-2">🎨 Effekt auswählen</h3>
      <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto text-sm">
        {COLOR_EFFECTS.map((eff, i) => (
          <div
            key={i}
            onClick={() => {
              updateMark(modalOpenIdx, { comment: eff.value });
              setModalOpenIdx(null);
            }}
            className="p-2 border rounded hover:bg-blue-100 cursor-pointer"
          >
            <div className="font-mono text-xs mb-1">{eff.value}</div>
            <div>{eff.label}</div>
          </div>
        ))}
      </div>
      <div className="text-right mt-4">
        <button onClick={() => setModalOpenIdx(null)} className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Abbrechen</button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}