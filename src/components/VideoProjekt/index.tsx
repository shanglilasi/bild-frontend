// components/VideoProjekt/index.tsx

import { useEffect, useRef, useState } from "react";
import FileTree from "./FileTree";
import { getDisplayUrlFromFullPath, formatTime } from "./helper";
import {
  fetchRelatedFiles,
  loadMarks,
  //saveMarks,
  
} from "./service";
import { EditableMark, FileEntry, VideoProjektProps, SchnittmarkenVariante } from "./types";
import { BASE_URL } from '../../config';

export default function VideoProjekt({ bildNr }: VideoProjektProps) {
  const [relatedFiles, setRelatedFiles] = useState<FileEntry[]>([]);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [selectedFileFullPath, setSelectedFileFullPath] = useState<string | null>(null);
  const [selectedFileType, setSelectedFileType] = useState<"image" | "video" | null>(null);
  const [marks, setMarks] = useState<EditableMark[]>([]);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isWorking, setIsWorking] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [markenVarianten, setMarkenVarianten] = useState<SchnittmarkenVariante[]>([]);
  const [selectedMarkenId, setSelectedMarkenId] = useState<number | null>(null);
  const [variantName, setVariantName] = useState("");
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    fetchRelatedFiles(String(bildNr)).then(setRelatedFiles);
  }, [bildNr]);

  const handleSelectFile = (fullPath: string) => {
    const url = getDisplayUrlFromFullPath(fullPath);
    if (!url) return;

    const ext = url.split(".").pop()?.toLowerCase();
    if (["mp4", "mov", "avi", "mpg"].includes(ext || "")) {
      setSelectedFileType("video");
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
        const res = await fetch(`${BASE_URL}/utils/schnittmarken_proj/${bildNr}/${encodedPath}`);
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
      const res = await fetch(`${BASE_URL}/utils/${endpoint}?${query}`);
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
      const res = await fetch(`${BASE_URL}/utils/marks/${bildNr}/${encoded}`, {
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
      const res = await fetch(`${BASE_URL}/utils/schnittmarken/${id}`);
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
            Ableger des Videos
            <button
              onClick={reloadFileTree}
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-sm px-2 py-1 rounded"
            >
              🔄 refresh
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
          <div className="w-full p-4 bg-gray-100 rounded shadow flex flex-col items-center gap-4">
            {isWorking && (
              <div className="text-blue-700 text-sm font-semibold animate-pulse text-center">
                ⏳ Aktion läuft. Je nach Operation und Länge des Videos – bitte etwas warten...
              </div>
            )}
            <div className="w-full flex flex-wrap gap-2 justify-center">
              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("reverse_video", {
                    video_path: selectedFileFullPath,
                    output_dir: "_rw",
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                🔁 Reverse
              </button>

              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("split_video", {
                    video_path: selectedFileFullPath,
                    output_dir: "_c",
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                ✂️ Split
              </button>

              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("save_frame", {
                    video_path: selectedFileFullPath,
                    output_dir: ".jpeg",
                    current_time: currentTime,
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                🌄JPG
              </button>

              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("convert_bw", {
                    video_path: selectedFileFullPath,
                    output_dir: "_SW",
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <span style={{ color: 'black' }}>Schwarz</span>
                <span style={{ color: 'white' }}>Weiss</span>
              </button>

              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("farbe_col", {
                    video_path: selectedFileFullPath,
                    output_dir: "_col",
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                <span style={{ color: 'red' }}>Far</span>
                <span style={{ color: 'green' }}>be</span>
                <span style={{ color: 'blue' }}>ff</span>
                <span style={{ color: 'pink' }}>ekt</span>
              </button>


              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("convert_mp4", {
                    video_path: selectedFileFullPath,
                    output_dir: ".MP4",
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                in MP4
              </button>

              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("rotate_video", {
                    video_path: selectedFileFullPath,
                    output_dir: "_rot",
                    angle: 90,
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                🔄 Rotieren (90°)
              </button>
              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("adjust_speed", {
                    video_path: selectedFileFullPath,
                    output_dir: "_speed",
                  
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                🔄 Timestretch
              </button>


              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("add_overlay", {
                    video_path: selectedFileFullPath,
                    output_dir: "_sub",
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Untertitel
              </button>

              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction("add_overlay_cut", {
                    video_path: selectedFileFullPath,
                    output_dir: "_cl",
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Bereinigen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-2/3 p-4 bg-gray-50 rounded shadow flex flex-col items-center justify-center min-h-[300px]">
        {selectedFileUrl ? (
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
                        <td className="p-1">
                          <input type="text" value={mark.comment} onChange={e => updateMark(idx, { comment: e.target.value })} className="border px-1 w-full" />
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
      </div>
    </div>
  );
}