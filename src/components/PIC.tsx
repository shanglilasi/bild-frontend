import { useEffect, useRef, useState } from "react"
import KategorieInfo from "./KategorieInfo"
import type { BildData } from '../types/Bild'


interface Kategorie {
  id: number;
  bezeichnung: string;
  beschreibung: string;
}


export default function PIC({ data }: { data: BildData }) {
  const [visible, setVisible] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [animatingOut, setAnimatingOut] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!visible || !data.NR) return

    const fetchKategorien = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5001/holeKatZuBild/${data.NR}`)
        const result = await res.json()
        setKategorien(result || [])
      } catch (err) {
        console.error("Fehler beim Laden der Kategorien:", err)
      }
    }

    fetchKategorien()
  }, [visible, data.NR])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    if (fullscreen) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [fullscreen])

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

  // IMG/VIDEO Element (nur dieses reagiert auf Klick)
  const mediaElement = isVideo ? (
    <video
      src={data.url}
      controls
      preload="none"
      className={`rounded transition-all duration-200 ${
        fullscreen ? "cursor-zoom-out max-h-screen max-w-screen" : "cursor-zoom-in w-full h-auto"
      }`}
      onClick={fullscreen ? handleClose : handleOpen}
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
      <p><strong>NR:</strong> {data.NR}</p>
      <p><strong>Titel:</strong> {data.titel}</p>
      <p><strong>Datum:</strong> {data.datum}</p>
      <p><strong>Kamera:</strong> {data.kamera}</p>
      <p><strong>Typ:</strong> {data.typ}</p>
      <p>{data.url}</p>
      {kategorien.length > 0 && (
        <div className="mt-1">
   
          <div className="mt-1 flex flex-wrap gap-1">
            {kategorien.map((k: any) => (
              <KategorieInfo
                key={k.id || k.bezeichnung}
                kategorie={k}
              />
            ))}
          </div>
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
          <div
            className={`transition-all duration-200 transform ${
              animatingOut ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            {mediaElement}
          </div>
        </div>
      )}
    </>
  )
}