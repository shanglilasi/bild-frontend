// components/SlideshowControler.tsx
import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/StoreContext";
import BildBeschreibungModal from "./BildBeschreibungModal";

export default function Slideshow() {
  const { suchStore } = useStore();
  const bilder = suchStore.results;
  const [index, setIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dauer, setDauer] = useState<number | null>(null);
  const [dauerEingabe, setDauerEingabe] = useState(5);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isRunning && bilder.length > 0) {
      setDauer(5);
      setIsRunning(true);
    }
  }, [bilder]);




  
  useEffect(() => {
    if (!isRunning || isPaused || showModal || dauer === null) return;

    const currentBild = bilder[index];
    const isVideo = currentBild.typ === "V" || currentBild.url.endsWith(".mp4");

  
    let timer: ReturnType<typeof setTimeout>;

    if (!isVideo) {
      timer = setTimeout(() => {
        setIndex((i) => (i + 1) % bilder.length);
      }, dauer * 1000);
    }

    return () => clearTimeout(timer);
  }, [index, isRunning, isPaused, showModal, dauer]);

  const handleVideoEnded = () => {
    if (isRunning && !isPaused) {
      setIndex((i) => (i + 1) % bilder.length);
    }
  };

  const pauseSlideshow = () => {
    setIsPaused(true);
    setShowModal(true);
  };

  const resumeSlideshow = () => {
    setShowModal(false);
    setIsPaused(false);
  };

  const handlePrev = () => setIndex((i) => (i - 1 + bilder.length) % bilder.length);
  const handleNext = () => setIndex((i) => (i + 1) % bilder.length);

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  if (!bilder.length) return <div>Keine Bilder gefunden.</div>;

  const current = bilder[index];
  const isVideo = current.typ === "V" || current.url.endsWith(".mp4");

  const togglePause = () => {
    if (isPaused) {
      resumeSlideshow();
    } else {
      pauseSlideshow();
    }
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showModal) return; // keine Steuerung während Modal offen ist
  
      switch (e.key) {
        case "ArrowLeft":
          handlePrev();
          break;
        case "ArrowRight":
          handleNext();
          break;
        case " ":
          e.preventDefault(); // verhindert Scrollen durch Space
          togglePause();
          break;
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal, handlePrev, handleNext, togglePause]);



  return (
    <div className="w-screen h-screen bg-black flex flex-col m-0 p-0 overflow-hidden relative">
      {/* Navigation links oben, überlagert das Bild */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 p-2 bg-black bg-opacity-70 text-white text-xs rounded z-10">
        <div>
          <input
            type="number"
            min={1}
            max={bilder.length}
            value={index + 1}
            onChange={(e) => {
              const newIndex = parseInt(e.target.value) - 1;
              if (!isNaN(newIndex) && newIndex >= 0 && newIndex < bilder.length) {
                setIndex(newIndex);
              }
            }}
            className="w-16 text-black px-1 rounded"
          />
          / {bilder.length}
        </div>

        <label>{dauerEingabe}</label>
        <input
          type="range"
          min={3}
          max={60}
          value={dauerEingabe}
          onChange={(e) => {
            const wert = parseInt(e.target.value);
            setDauerEingabe(wert);
            if (isRunning) setDauer(wert);
          }}
          className="w-24"
        />

        {!isRunning ? (
          <button
            onClick={() => {
              setDauer(dauerEingabe);
              setIsRunning(true);
            }}
            className="px-2 py-1 bg-green-600 text-white rounded text-xs"
          >
            ▶️
          </button>
        ) : (
          <>
            <button onClick={pauseSlideshow} className="px-2 py-1 bg-gray-500 text-white rounded">
              ⏸️
            </button>
            <button onClick={handlePrev} className="px-2 py-1 bg-gray-500 text-white rounded">
              ⏮️
            </button>
            <button onClick={handleNext} className="px-2 py-1 bg-gray-500 text-white rounded">
              ⏭️
            </button>
          </>
        )}

        <button onClick={toggleFullscreen} className="px-2 py-1 bg-gray-500 text-white rounded">
          ⇱⇲
        </button>
      </div>

      {/* Bild-/Videoanzeige bleibt zentriert */}
      <div className="flex-1 flex items-center justify-center bg-black overflow-hidden">
        {isVideo ? (
          <video
            ref={videoRef}
            src={current.url.replace("/images/", "/videos/")}
            controls
            autoPlay
            onEnded={handleVideoEnded}
            onDoubleClick={togglePause}
            className="max-w-full max-h-full object-contain cursor-pointer"
          />
        ) : (
          <img
            src={current.url}
            alt={current.titel}
            onClick={togglePause}
            className="max-w-full max-h-full object-contain cursor-pointer"
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <BildBeschreibungModal
          nr={current.NR}
          onClose={() => resumeSlideshow()}
        />
      )}
    </div>
  );
}