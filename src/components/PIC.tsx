// scr/components/PIC.tsx

import { useEffect, useRef, useState } from "react"
import KategorieInfo from "./KategorieInfo"
import type { BildData } from "../types/Bild"
import BildBeschreibungModal from "./BildBeschreibungModal"

interface Kategorie {
  id: number
  bezeichnung: string
  beschreibung: string
}

export default function PIC({ data }: { data: BildData }) {
  const [visible, setVisible] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [animatingOut, setAnimatingOut] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isVideo = data.url.endsWith(".mp4") || data.typ === "V"
  const [kategorien, setKategorien] = useState<Kategorie[]>([])



  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  const fetchKategorien = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/holeKatZuBild/${data.NR}`)
      const result = await res.json()
      setKategorien(result || [])
    } catch (err) {
      console.error("Fehler beim Laden der Kategorien:", err)
    }
  }
  
  useEffect(() => {
    if (!visible || !data.NR) return
    fetchKategorien()
  }, [visible, data.NR])

  const handleOpen = () => {
    setFullscreen(true)
  }

  const handleClose = () => {
    setAnimatingOut(true)
    setTimeout(() => {
      setFullscreen(false)
      setAnimatingOut(false)
    }, 200)
  }

  const handleVideoDoubleClick = () => {
    if (videoRef.current) {
      const video = videoRef.current
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    }
  }

  if (!data.url) {
    console.warn(`Fehlende oder ungültige Bild-URL für Bild ${data.NR}`, data)
    return null
  }

  const mediaElement = isVideo ? (
    <video
      ref={videoRef}
      src={data.url}
      controls
      preload="auto"
      className={`rounded transition-all duration-200 ${
        fullscreen ? "cursor-pointer max-h-screen max-w-screen" : "cursor-zoom-in w-full h-auto"
      }`}
      onClick={() => {
        if (!fullscreen) handleOpen()
      }}
      onDoubleClick={handleVideoDoubleClick}
    />
  ) : (
    <img
      src={data.url}
      alt={data.titel || "Bild"}
      className={`rounded transition-all duration-200 ${
        fullscreen ? "cursor-zoom-out max-h-screen max-w-screen" : "cursor-zoom-in w-full h-auto"
      }`}
      loading="lazy"
      onClick={fullscreen ? handleClose : handleOpen}
    />
  )

  const infoBlock = (
    <div className="mt-2 text-left text-sm space-y-1">
      
      <div className="flex items-center justify-between text-sm mt-2 text-left">
  <strong onClick={() => setModalOpen(true)}>🛠️ {data.NR}</strong>
  <a
    href={data.url}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-blue-800 text-lg"
    title="Bild in neuem Tab öffnen"
  >
    🔍
  </a>
</div>

      
      <p><strong>Titel:</strong> {data.titel}</p>
      <p><strong>Datum:</strong> {data.datum}</p>
      <p><strong>Kamera:</strong> {data.kamera}</p>
      <p><strong>Fotograf:</strong> {data.fotograf}</p>


      {kategorien.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1 max-h-24 overflow-y-auto">
          {kategorien.map((k: any) => (
            <KategorieInfo key={k.id || k.bezeichnung} kategorie={k} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <>
      <div ref={ref}>
        {!fullscreen && (
          <div className="border rounded shadow p-4 bg-white">
            {visible ? mediaElement : (
              <div className="h-[200px] bg-gray-200 animate-pulse rounded"></div>
            )}
            {infoBlock}
          </div>
        )}
      </div>

      {fullscreen && (
        <div
          className={`fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-90 p-4 transition-opacity duration-200 ${
            animatingOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white text-3xl font-bold z-50 hover:text-red-400"
          >
            &times;
          </button>

          <div
            className={`transition-all duration-200 transform ${
              animatingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            {mediaElement}
          </div>
        </div>
      )}

      {/* Modal für Bearbeitung */}
      {modalOpen && (
  <BildBeschreibungModal
    nr={data.NR}
    onClose={(refresh) => {
      setModalOpen(false)
      if (refresh) {
        fetchKategorien()
      }
    }}
  />
)}
    </>
  )
}
