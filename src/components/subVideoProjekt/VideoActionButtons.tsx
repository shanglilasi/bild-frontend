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

type Action = {
  label: string;
  tooltip: string;
  endpoint: string;
  params: (path: string, time?: number) => Record<string, string | number | boolean>;
};

type Separator = {
  label: string;
  isSeparator: true;
};

type ActionOrSeparator = Action | Separator;

const actions: ActionOrSeparator[] = [
  {
    label: "🔁 Reverse",
    tooltip:
      "Erstellt eine Kopie des Videos die rückwärts läuft. Auch der Ton läuft dabei rückwärts. Keine Aktionsdatei nötig.",
    endpoint: "reverse_video",
    params: (path) => ({ video_path: path, output_dir: "_rw" }),
  },
  {
    label: "⬛⬜ SchwarzWeiss",
    tooltip: "Wandelt das Video in Schwarz-Weiß um.",
    endpoint: "convert_bw",
    params: (path) => ({ video_path: path, output_dir: "_SW" }),
  },
  {
    label: "📼 in MP4",
    tooltip:
      "Konvertiert in Kopie das Video in das MP4-Format das kompatibel mit Quicktime ist.",
    endpoint: "convert_mp4",
    params: (path) => ({ video_path: path, output_dir: ".MP4" }),
  },
  {
    label: "🔄 Rotieren (90°)",
    tooltip: "Dreht das Video um 90 Grad im Uhrzeigersinn.",
    endpoint: "rotate_video",
    params: (path) => ({ video_path: path, output_dir: "_rot", angle: 90 }),
  },
  {
    label: "🌄 JPG",
    tooltip:
      "Speichert das aktuelle Videobild an der aktuellen Position als JPG-Datei. Wenn die Position 0 ist, wird dies nicht in dem Dateinamen mit aufgenommen, und damit als Vorschaubild verwendet.",
    endpoint: "save_frame",
    params: (path, time = 0) => ({ video_path: path, current_time: time }),
  },

  // Trennung
  { label: "---", isSeparator: true },

  {
    label: "✂️ Split",
    tooltip:
      "Zerteilt das Video in mehrere Einzelclips. Kann auch als Trimm-Funktion genutzt werden. Aktionsdatei mit Stopmarken nötig. Es muss immer ein Start und eine Ende gesetzt werden. Das Video in 2 Teile zu teilene erfordert also 3 Schnittmarken.",
    endpoint: "split_video",
    params: (path) => ({ video_path: path, output_dir: "_c" }),
  },
  {
    label: "🎨 Farbeffekt",
    tooltip:
      "Wendet Farbeffekte (Kontrast, Sättigung etc.) auf das Video an. Aktionsskript nötig. Über den Schalter 🎛 können bereits definierte Effekte gewählt werden, oder auch frei eingetragen bzw. abgeändert werden.",
    endpoint: "farbe_col",
    params: (path) => ({ video_path: path, output_dir: "_col" }),
  },
  {
    label: "⏩ Timestretch",
    tooltip:
      "Verändert die Abspielgeschwindigkeit des Videos. Aktionsskript nötig, in dem der Geschwindigkeitffaktor zwischen 0,5(halbe) und 2(doppelte) Geschwindigkeit gesetzt wird.",
    endpoint: "adjust_speed",
    params: (path) => ({ video_path: path, output_dir: "_speed" }),
  },
  {
    label: "🛑 Stopp_X/Audio",
    tooltip:
      "Ermöglicht es, das Video an bestimmten Stellen für eine definierte Zeit anzuhalten. Aktionsskript nötig. In dieser Zeit kann eine m4a-Datei als Tonspur gesetzt werden. Beispiel: Ich möchte das Bild für 8 Sekunden (maximal 30 s zulässig) anhalten, und hier meine Sprachnotiz abspielen. Schreibweise: '8/Sprachnotiz1.m4a' Achtung: Es wird hier die kürzere Zeit verwendet, also nur für 3 sec angehalten, wenn die Sprachnotiz nur 3 Sekunden lang ist.",
    endpoint: "stopmotion",
    params: (path) => ({ video_path: path, output_dir: "_stop" }),
  },
  {
    label: "💬 Untertitel",
    tooltip:
      "Fügt dem Video Untertitel hinzu, die in einem Aktionsskript stehen müssen. Der Untertitel steht immer bis zum nächsten Marker. Die Untertitel können in 3 Größen und diversen Farben und Schattierungen gesetzt werden. Mit D&D kann die Farbe übernommen werden.",
    endpoint: "add_overlay",
    params: (path) => ({ video_path: path, output_dir: "_sub" }),
  },
  {
    label: "🧹 Bereinigen",
    tooltip:
      "Es werden ähnlich wie bei Split Teile aus dem Video geschnitten. Hier kann aber gezielter ausgewählt werden, welche Teile behalten werden. Dazu muss die Schnittmarke gesetzt werden, und darf nicht leer sein. Der Kommentar ist ansonsten unerheblich, kann aber ggf. später für eine Suche interessant sein.",
    endpoint: "add_overlay_cut",
    params: (path) => ({ video_path: path, output_dir: "_cl" }),
  },
  {
    label: "🪟 XCross-Schnitt",
    tooltip:
      "Es werden ähnlich wie bei Split Teile aus dem Video geschnitten. Teile die behalten werden sollen müssen in Methode keep stehen haben. Mit blend kann eine für die angegebene Dauer laufend Einblendung erfolgen. ",
    endpoint: "blend",
    params: (path) => ({ video_path: path, output_dir: "_blend" }),
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

          const realAction = action as Action;

          const params =
            realAction.endpoint === "save_frame"
              ? realAction.params(selectedFileFullPath, currentTime)
              : realAction.params(selectedFileFullPath);

          return (
            <div key={index} className="relative">
              <button
                disabled={isWorking}
                onClick={() => handleVideoAction(realAction.endpoint, params)}
                className={`flex items-center px-3 py-1 rounded text-white gap-2 ${
                  isWorking
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {realAction.label}
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
                  {realAction.tooltip}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}