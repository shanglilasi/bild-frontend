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
    label: "⬛⬜ SchwarzWeiss",
    tooltip: "Wandelt das Video in Schwarz-Weiß um.",
    endpoint: "convert_bw",
    params: (path: string) => ({ video_path: path, output_dir: "_SW" }),
  },
  {
    label: "📼 in MP4",
    tooltip: "Konvertiert in Kopie das Video in das MP4-Format das kompatibel mit Quicktime ist.",
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
    label: "🌄 JPG",
    tooltip: "Speichert das aktuelle Videobild an der aktuellen Position als JPG-Datei.",
    endpoint: "save_frame",
    params: (path: string, time: number) => ({
      video_path: path,
      current_time: time,
    }),
  },

  // 🔻 Gruppentrenner
  { label: "---", isSeparator: true },

  {
    label: "✂️ Split",
    tooltip: "Zerteilt das Video in mehrere Einzelclips. Aktionsdatei mit Stopmarken nötig.",
    endpoint: "split_video",
    params: (path: string) => ({ video_path: path, output_dir: "_c" }),
  },
  {
    label: "🎨 Farbeffekt",
    tooltip: "Wendet Farbeffekte auf das Video an. Aktionsskript nötig.",
    endpoint: "farbe_col",
    params: (path: string) => ({ video_path: path, output_dir: "_col" }),
  },
  {
    label: "⏩ Timestretch",
    tooltip: "Verändert die Abspielgeschwindigkeit des Videos. Aktionsskript nötig.",
    endpoint: "adjust_speed",
    params: (path: string) => ({ video_path: path, output_dir: "_speed" }),
  },
  {
    label: "🛑 Stopp_X/Audio",
    tooltip: "Hält das Video für eine definierte Zeit an und spielt ggf. eine Audiodatei ab. Aktionsskript nötig.",
    endpoint: "stopmotion",
    params: (path: string) => ({ video_path: path, output_dir: "_stop" }),
  },
  {
    label: "💬 Untertitel",
    tooltip: "Fügt dem Video Untertitel hinzu, die in einem Aktionsskript stehen müssen.",
    endpoint: "add_overlay",
    params: (path: string) => ({ video_path: path, output_dir: "_sub" }),
  },
  {
    label: "🧹 Bereinigen",
    tooltip: "Schneidet gezielt Teile aus dem Video. Aktionsmarken nötig.",
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
        {actions.map((action, index) => {
          if ("isSeparator" in action && action.isSeparator) {
            return (
              <div
                key={`sep-${index}`}
                className="w-full my-4 border-t border-gray-400"
              />
            );
          }

          return (
            <div key={index} className="relative">
              <button
                disabled={isWorking}
                onClick={() =>
                  handleVideoAction(
                    action.endpoint,
                    typeof action.params === "function"
                      ? action.endpoint === "save_frame"
                        ? action.params(selectedFileFullPath, currentTime)
                        : action.params(selectedFileFullPath)
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
          );
        })}
      </div>
    </div>
  );
}