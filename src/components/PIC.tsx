// src/components/PIC.tsx

import { useEffect, useRef, useState } from "react"
import KategorieInfo from "./KategorieInfo"
import type { BildData } from "../types/Bild"
import BildBeschreibungModal from "./BildBeschreibungModal"
import { BASE_URL } from '../config';
import type { Kategorie } from '../types/Kategorie'


export default function PIC({ data }: { data: BildData }) {
  const videoExtensions = ['.mp4', '.avi', '.mov', '.webm', '.mkv']
  const isVideo = data.typ === 'V' || videoExtensions.some(ext => data.url.toLowerCase().endsWith(ext))


  const [visible, setVisible] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [animatingOut, setAnimatingOut] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [fullscreenType, setFullscreenType] = useState<"image" | "video">("image")
  const [fullscreenUrl, setFullscreenUrl] = useState("")
  const ref = useRef<HTMLDivElement>(null)
 
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
      const res = await fetch(`${BASE_URL}/bilder/holeKatZuBild/${data.NR}`)
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
    if (isVideo) {
      setFullscreenUrl(data.url.replace("/images/", "/videos/")) // Video-URL für Fullscreen
      setFullscreenType("video")
    } else {
      setFullscreenUrl(data.url) // Bild-URL für Fullscreen
      setFullscreenType("image")
    }
    setFullscreen(true)
  }

  const handleClose = () => {
    setAnimatingOut(true)
    setTimeout(() => {
      setFullscreen(false)
      setAnimatingOut(false)
    }, 200)
  }

  if (!data.url) {
    console.warn(`Fehlende oder ungültige Bild-URL für Bild ${data.NR}`, data)
    return null
  }

  const mediaElement = (
    <div className="relative w-full h-auto" onClick={handleOpen}>
      <img
        src={data.url}
        alt={data.titel || "Bild"}
        className={`rounded transition-all duration-200 ${
          fullscreen ? "cursor-zoom-out max-h-screen max-w-screen" : "cursor-zoom-in w-full h-auto"
        }`}
        loading="lazy"
      />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black bg-opacity-50 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M6.5 5.5v9l7-4.5-7-4.5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )

  const infoBlock = (
    <div className="mt-2 text-left text-sm space-y-1">
      <div className="flex items-center justify-between text-sm mt-2 text-left">
      <span
  onClick={() =>{console.log("Klick!"); setModalOpen(true)}}
  className="text-blue-600 hover:underline cursor-pointer font-mono text-sm"
  title="Bearbeiten"
>
  🛠️ {data.datei}
</span>
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-800 text-lg" 
          title="Bild in neuem Tab öffnen"
        >
          ⬈
        </a>
      </div>
      <p><strong>NR:</strong>{data.NR}</p>
      <p><strong>Titel:</strong> {data.titel}</p>
      <p><strong>Datum:</strong> {data.datum}</p>
      <p><strong>Kamera:</strong> {data.kamera}</p>
      <p><strong>Fotograf:</strong> {data.fotograf}</p>
      
      {kategorien.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1 max-h-24 overflow-y-auto">
          {kategorien.map((k: any) => (
            
        <KategorieInfo
          kategorie={k}
      
/>


       


            
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

      {/* Fullscreen / Layer Ansicht */}
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
            {fullscreenType === "video" ? (
              <video
                src={fullscreenUrl}
                controls
                title="Kein autoplay"
                className="max-w-full max-h-screen rounded"
              />
            ) : (
              <img
                src={fullscreenUrl}
                alt="Vollbildansicht"
              
                className="max-w-full max-h-screen rounded"
              />
            )}
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