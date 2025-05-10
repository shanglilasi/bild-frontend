// components/VideoProjekt/VideoActionButtons.tsx
import React from "react";

interface VideoActionButtonsProps {
  selectedFileFullPath: string;
  isWorking: boolean;
  currentTime: number;
  handleVideoAction: (
    endpoint: string,
    params: Record<string, string | number | boolean>
  ) => void;
}

export default function VideoActionButtons({
  selectedFileFullPath,
  isWorking,
  currentTime,
  handleVideoAction,
}: VideoActionButtonsProps) {
  if (!selectedFileFullPath) return null;

  return (



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
                  handleVideoAction("stopmotion", {
                    video_path: selectedFileFullPath,
                    output_dir: "_stop",
                  
                  })
                }
                className={`px-3 py-1 rounded text-white ${
                  isWorking ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Stopp_X/Audio
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
   
            )
        }