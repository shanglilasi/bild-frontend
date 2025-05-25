import { useState } from "react";

interface VideoActionButtonsProps {
  selectedFileFullPath: string;
  isWorking: boolean;
  currentTime: number;
  handleVideoAction: (
    endpoint: string,
    params: Record<string, string | number | boolean>
  ) => void;
}

const actions = [
  {
    label: "🔁 Reverse",
    tooltip: "Erstellt eine Kopie des Videos die rückwärts läuft. Auch der Ton läuft dabei rückwärts. Keine Aktionsdatei nötig.",
    endpoint: "reverse_video",
    params: (path: string) => ({ video_path: path, output_dir: "_rw" }),
  },
  {
    label: "✂️ Split",
    tooltip: "Zerteilt das Video in mehrere Einzelclips. Kann auch als Trimm-Funktion genutzt werden. Aktionsdatei mit Stopmarken nötig. Es muss immer ein Start und eine Ende gesetzt werden. Das Video in 2 Teile zu teilene erfordert also 3 Schnittmarken. ",
    endpoint: "split_video",
    params: (path: string) => ({ video_path: path, output_dir: "_c" }),
  },
  {
    label: "🌄 JPG",
    tooltip: "Speichert das aktuelle Videobild an der aktuellen Position als JPG-Datei. Wenn die Position 0 ist, wird dies nicht in dem Dateinamen mit aufgenommen, und damit als Vorschaubild verwendet.",
    endpoint: "save_frame",
    params: (path: string, time: number) => ({
      video_path: path,
      
      current_time: time,
    }),
  },
  {
    label: "⬛⬜ SchwarzWeiss",
    tooltip: "Wandelt das Video in Schwarz-Weiß um.",
    endpoint: "convert_bw",
    params: (path: string) => ({ video_path: path, output_dir: "_SW" }),
  },
  {
    label: "🎨 Farbeffekt",
    tooltip: "Wendet Farbeffekte (Kontrast, Sättigung etc.) auf das Video an. Aktionsskript nötig. Über den Schalter 🎛 können bereits definierte Effekte gewählt werden, oder auch frei eingetragen bzw. abgeändert werden.",
    endpoint: "farbe_col",
    params: (path: string) => ({ video_path: path, output_dir: "_col" }),
  },
  {
    label: "📼 in MP4",
    tooltip: "Konvertiert in Kopie das Video in das MP4-Format das kompatibel mit Quicktime ist. ",
    endpoint: "convert_mp4",
    params: (path: string) => ({ video_path: path, output_dir: ".MP4" }),
  },
  {
    label: "🔄 Rotieren (90°)",
    tooltip: "Dreht das Video um 90 Grad im Uhrzeigersinn.",
    endpoint: "rotate_video",
    params: (path: string) => ({
      video_path: path,
      output_dir: "_rot",
      angle: 90,
    }),
  },
  {
    label: "⏩ Timestretch",
    tooltip: "Verändert die Abspielgeschwindigkeit des Videos. Aktionsskript nötig, in dem der Geschwindigkeitffaktor zwischen 0,5(halbe) und 2(doppelte) Geschwindigkeit gesetzt wird .",
    endpoint: "adjust_speed",
    params: (path: string) => ({ video_path: path, output_dir: "_speed" }),
  },
  {
    label: "🛑 Stopp_X/Audio",
    tooltip: "Ermöglicht es, das Video an bestimmten Stellen für eine definierte Zeit anzuhalten. Aktionsskript nötig.. In dieser Zeit kann eine m4a-Datei als Tonspur gesetzt werden.Beispiel: Ich möchte das Bild für 8 Sekunden (maximal 30 s zulässig) anhalten, und hier meine Sprachnotiz abspielen. Schreibweise: '8/Sprachnotiz1.m4a' Achtung: Es wird hier die kürzere Zeit verwendet, also nur für 3 sec angehalten, wenn die Sprachnotiz nur 3 Sekunden lang ist..",
    endpoint: "stopmotion",
    params: (path: string) => ({ video_path: path, output_dir: "_stop" }),
  },
  {
    label: "💬 Untertitel",
    tooltip: "Fügt dem Video  Untertitel hinzu, die in einem Aktionsskript stehen müssen. Der Untertitel steht immer bis zum nächsten Marker. DIe Untertitel können in 3 Größen und diversen Farben und Schatierungen gesetzt werden. Mit D&D kann die Farbe übernommen werden.",
    endpoint: "add_overlay",
    params: (path: string) => ({ video_path: path, output_dir: "_sub" }),
  },
  {
    label: "🧹 Bereinigen",
    tooltip: "Es werden ähnlich wie bei Split Teile aus dem Video geschnitten. Hier kann aber geziehter ausgewählt werden, welche Teile behalten werden. Dazu muss die Schnittmarke gesetzt werden, und darf nicht leer sein. Der Kommentar ist ansonsten unerheblich, kann aber ggf  später für eine Suche interessant sein..",
    endpoint: "add_overlay_cut",
    params: (path: string) => ({ video_path: path, output_dir: "_cl" }),
  },
];

export default function VideoActionButtons({
  selectedFileFullPath,
  isWorking,
  currentTime,
  handleVideoAction,
}: VideoActionButtonsProps) {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  if (!selectedFileFullPath) return null;

  const toggleTooltip = (index: number) => {
    setActiveTooltip(activeTooltip === index ? null : index);
  };

  return (
    <div className="w-full p-4 bg-gray-100 rounded shadow flex flex-col items-center gap-4">
      {isWorking && (
        <div className="text-blue-700 text-sm font-semibold animate-pulse text-center">
          ⏳ Aktion läuft. Je nach Operation und Länge des Videos – bitte etwas warten...
        </div>
      )}

      <div className="w-full flex flex-wrap gap-2 justify-center">
        {actions.map((action, index) => (
          <div key={index} className="relative">
            <button
              disabled={isWorking}
              onClick={() =>
                handleVideoAction(
                  action.endpoint,
                  typeof action.params === "function"
                    ? action.endpoint === "save_frame"
                      ? action.params(selectedFileFullPath, currentTime)
                      : action.params(selectedFileFullPath, currentTime)
                    : {}
                )
              }
              className={`flex items-center px-3 py-1 rounded text-white gap-2 ${
                isWorking
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {action.label}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTooltip(index);
                }}
                className="ml-1 text-white font-bold text-sm bg-blue-700 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                title="Mehr Info"
              >
                i
              </span>
            </button>

            {activeTooltip === index && (
         <div className="absolute z-10 mt-1 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow w-64">
         {action.tooltip}
       </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}