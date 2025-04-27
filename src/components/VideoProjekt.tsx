//components/VideoProjekt.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Chapter {
  time: number;
  title: string;
}

interface FileEntry {
  name: string;
  isFolder: boolean;
  children?: FileEntry[];
}

interface VideoProjektProps {
  bildNr: number;
}

export default function VideoProjekt({ bildNr }: VideoProjektProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [relatedFiles, setRelatedFiles] = useState<FileEntry[]>([]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchVideoUrl();
    fetchChapters();
    fetchRelatedFiles();
  }, [bildNr]);

  const fetchVideoUrl = async () => {
    try {
      const res = await fetch(`${BASE_URL}/utils/videoUrl?nr=${bildNr}`);
      if (!res.ok) throw new Error("Fehler beim Laden der Video-URL.");
      const data = await res.json();
      setVideoUrl(data.videoUrl); // Backend muss { videoUrl: "videos/..." } liefern
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChapters = async () => {
    try {
      const res = await fetch(`${BASE_URL}/utils/videoChapters?nr=${bildNr}`);
      if (!res.ok) throw new Error("Chapter file not found");

      const text = await res.text();
      const lines = text.split("\n");
      const loadedChapters = lines.map(line => {
        const [timeStr, title] = line.split(";", 2);
        return { time: parseFloat(timeStr.trim()), title: title.trim() };
      });
      setChapters(loadedChapters);
    } catch (error) {
      console.warn("Keine Kapiteldatei gefunden.", error);
      setChapters([{ time: 0, title: "Start" }]);
    }
  };

  const fetchRelatedFiles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/utils/listFilesTree?nr=${bildNr}`);
      if (!res.ok) throw new Error("Fehler beim Laden der zugehörigen Dateien.");
      const data = await res.json();
      setRelatedFiles(data.entries);
    } catch (error) {
      console.error(error);
    }
  };

  const jumpToChapter = (time: number) => {
    const video = document.getElementById("video-player") as HTMLVideoElement;
    if (video) {
      video.currentTime = time;
      video.play();
    }
  };

  const changePlaybackRate = () => {
    const video = document.getElementById("video-player") as HTMLVideoElement;
    if (video) {
      const newRate = playbackRate === 2 ? 1 : playbackRate + 0.5;
      setPlaybackRate(newRate);
      video.playbackRate = newRate;
    }
  };

  return (
    <div className="space-y-6">
      {/* Video-Container */}
      <div className="bg-gray-100 p-4 rounded shadow relative">
        {videoUrl ? (
          <video
            id="video-player"
            controls
            className="w-full max-w-5xl mx-auto rounded"
            src={`${BASE_URL}/${videoUrl}`}
          />
        ) : (
          <div className="text-center text-gray-500">Video wird geladen...</div>
        )}

        {/* Kapitel-Marken */}
        {chapters.length > 1 && (
          <div className="absolute top-2 left-0 right-0 flex justify-between px-4 pointer-events-none">
            {chapters.map((chap, idx) => (
              <motion.div
                key={idx}
                className="h-1 w-1 bg-blue-500 rounded-full"
                style={{ transform: `translateX(${(chap.time / (chapters.at(-1)?.time ?? 1)) * 100}%)` }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              />
            ))}
          </div>
        )}

        {/* Zusätzliche Buttons */}
        <div className="absolute top-2 right-4 flex gap-2">
          <button
            onClick={changePlaybackRate}
            className="bg-white bg-opacity-70 hover:bg-opacity-100 px-2 py-1 rounded text-xs"
          >
            {playbackRate}x
          </button>
          <button
            onClick={() => (document.getElementById("video-player") as HTMLVideoElement)?.requestFullscreen()}
            className="bg-white bg-opacity-70 hover:bg-opacity-100 px-2 py-1 rounded text-xs"
          >
            Vollbild
          </button>
        </div>
      </div>

      {/* Kapitel-Liste */}
      {chapters.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Kapitel</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {chapters.map((chap, index) => (
              <motion.div
                key={index}
                onClick={() => jumpToChapter(chap.time)}
                className="cursor-pointer p-2 bg-gray-50 hover:bg-gray-200 rounded shadow text-sm"
                whileHover={{ scale: 1.05 }}
              >
                <div className="font-semibold">{formatTime(chap.time)}</div>
                <div>{chap.title}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Verknüpfte Dateien & Ordner */}
      {relatedFiles.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold mb-4">Weitere Dateien und Ordner</h3>
          <div className="space-y-2">
            {relatedFiles.map((entry, idx) => (
              <FileTree key={idx} entry={entry} basePath={""} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FileTree({ entry, basePath }: { entry: FileEntry, basePath: string }) {
  const [open, setOpen] = useState(false);

  if (entry.isFolder) {
    return (
      <div className="pl-2">
        <div
          className="cursor-pointer flex items-center gap-2 font-semibold text-blue-700"
          onClick={() => setOpen(!open)}
        >
          {open ? "📂" : "📁"} {entry.name}
        </div>
        {open && entry.children && (
          <div className="pl-4">
            {entry.children.map((child, idx) => (
              <FileTree key={idx} entry={child} basePath={`${basePath}/${entry.name}`} />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="pl-4 text-gray-700">
        📄 {entry.name}
      </div>
    );
  }
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}