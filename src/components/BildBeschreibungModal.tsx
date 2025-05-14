//components/BildBeschreibungModal.tsx


import { useEffect, useRef, useState } from "react"
import { useStore } from "../store/StoreContext"
import KategorieCombobox from "./KategorieCombobox"
import type { BildData } from "../types/Bild"
import ExifInfo from "./ExifInfo"
import LlmInfo from "./LlmInfo"
import { BildLink } from "./BildLink"
import VideoProjekt from "./VideoProjekt"
import { BASE_URL } from '../config';

export default function BildBeschreibungModal({
  nr,
  onClose,
}: {
  nr: number
  onClose: (refresh?: boolean) => void
}) {
  const { kategorieStore, suchStore } = useStore();
  const [bild, setBild] = useState<BildData | null>(null);
  const [originalBild, setOriginalBild] = useState<BildData | null>(null);
  const [kategorien, setKategorien] = useState<any[]>([]);
  const [vorgeschlageneKategorien, setVorgeschlageneKategorien] = useState<any[]>([]);

  const [refreshNeeded, setRefreshNeeded] = useState(false);
  const [lastPicInfo, setLastPicInfo] = useState<{ NR: number; info: string } | null>(null);
  const [navigationMode, setNavigationMode] = useState<'Aufnahmedatum' | 'nr'>('Aufnahmedatum');
  const [isChronoActive, setIsChronoActive] = useState(false);
  const [ansichtModus, setAnsichtModus] = useState<"normal" | "exif" | "llm">("normal");
  const modalRef = useRef<HTMLDivElement>(null);
  const [showVideoProjekt, setShowVideoProjekt] = useState(false);
  const handleKategorieHinzufuegen = async (katId: string | number) => {
    try {
      await fetch(`${BASE_URL}/bilder/addKat/${bild?.NR}/${katId}`, {
        method: "POST",
      })
      if (bild?.NR) {
        await reloadKategorien(bild.NR)
      }
      setRefreshNeeded(true)
    } catch (err) {
      console.error("Fehler beim Hinzufügen:", err)
    }
  };

  const handleKategorieEntfernen = async (katId: number) => {
    try {
      await fetch(`${BASE_URL}/bilder/remKat/${bild?.NR}/${katId}`, {
        method: "DELETE",
      })
      await reloadKategorien(nr)
      setRefreshNeeded(true)
    } catch (err) {
      console.error("Fehler beim Entfernen:", err)
    }
  };

  const reloadKategorien = async (bildNr: number) => {
    const res = await fetch(`${BASE_URL}/bilder/holeKatZuBild/${bildNr}`)
    const data = await res.json()
    setKategorien(data)
  }

  const loadBild = async (nummer: number) => {
    const res = await fetch(`${BASE_URL}/bilder/bild/${nummer}`)
    const data = await res.json()
    const url = `${BASE_URL}/utils/images/${data.bild.pfad}${data.bild.datei}`
    const loaded: BildData = {
      NR: data.bild.NR,
      datei:data.bild.datei?? '',
      titel: data.bild.titel ?? '',
      datum: data.bild.AUFNAHMEDATUM ?? '',
      kamera: data.bild.kamera ?? '',
      typ: data.bild.typ ?? '',
      url,
      kategorie: data.bild.kategorie ?? '',
      fotograf: data.bild.fotograf ?? '',
    }

    setBild(loaded)
    setOriginalBild(loaded)
  }

  const fetchVorschlaege = async () => {
    if (!bild?.NR || typeof bild.NR !== 'number') return
  
    try {
      const url = `${BASE_URL}/bilder/propKat/${bild.NR}/10`
      const res = await fetch(url)
      const data = await res.json()
      setVorgeschlageneKategorien(data)
    } catch (err) {
      console.error("Fehler beim Laden der Vorschläge:", err)
    }
  }

  const fetchLastPicInfo = async () => {
    try {
      const res = await fetch(`${BASE_URL}/bilder/lastPicInfo/${nr}`)
      const data = await res.json()
      setLastPicInfo(data.bild)
    } catch (err) {
      console.error("Fehler beim Laden des vorherigen Bildes:", err)
    }
  }

  const handleChronoNavigation = async (direction: 'prev' | 'next') => {
    if (!bild) return;
  
    await saveChangesIfNeeded(); // <--- NEU: Änderungen speichern!
  
    try {
      const res = await fetch(
        `${BASE_URL}/bilder/chrono/${navigationMode}/${bild.NR}/${direction}`
      );
      const data = await res.json();
      if (!data?.NR) {
        alert("Kein weiteres Bild gefunden.");
        return;
      }
  
      const url = `${BASE_URL}/utils/images/${data.pfad}/${data.datei}`;
      const loaded: BildData = {
        NR: data.NR,
        datei: data.datei ?? '',
        titel: data.titel ?? '',
        datum: data.AUFNAHMEDATUM ?? '',
        kamera: data.kamera ?? '',
        typ: data.typ ?? '',
        url,
        kategorie: data.kategorie ?? '',
        fotograf: data.fotograf ?? '',
      };
  
      setBild(loaded);
      setOriginalBild(loaded);
      setRefreshNeeded(true);
  
      await reloadKategorien(data.NR);
      await fetchVorschlaege();
    } catch (err) {
      console.error("Fehler bei der Chrono-Navigation:", err);
    }
  };

  useEffect(() => {
    loadBild(nr)
    reloadKategorien(nr) // <--- DAS FEHLTE!
    fetchVorschlaege()
    fetchLastPicInfo()
  }, [nr])

  const handleChange = (field: keyof BildData, value: string) => {
    if (!bild) return
    setBild({ ...bild, [field]: value })
  }

  const hasCriticalChanges = () => {
    return (
      originalBild &&
      (bild?.kamera !== originalBild.kamera || bild?.fotograf !== originalBild.fotograf)
    )
  }

  const confirmCriticalChanges = () => {
    return window.confirm(
      "Du hast Kamera oder Fotograf geändert. Bist du sicher, dass du diese Änderung speichern willst?"
    )
  }

  

 
  const handleBackgroundClick = async (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      await saveChangesIfNeeded();
      onClose(refreshNeeded);
    }
  };

  const saveChangesIfNeeded = async () => {
    if (!bild) return;
  
    if (hasCriticalChanges() && !confirmCriticalChanges()) {
      return;
    }
  
    try {
      const cleanBild = {
        ...bild,
        datum: bild.datum || "",
        typ: bild.typ || "",
      };
  
      const res = await fetch(`${BASE_URL}/bilder/bild/${cleanBild.NR}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanBild),
      });
  
      if (!res.ok) throw new Error("Fehler beim Speichern");
  
      const isTreffer = suchStore.results.some((b) => b.NR === cleanBild.NR);
      if (isTreffer) {
        suchStore.updateBild(cleanBild);
      }
  
      setOriginalBild(cleanBild); // Aktualisiere Originalbild nach erfolgreichem Speichern
      setRefreshNeeded(true);
    } catch (err) {
      console.error(err);
      alert("Speichern fehlgeschlagen");
    }
  };




  const handleSameAsLastPic = async () => {
    if (!lastPicInfo) return

    try {
      const res = await fetch(`${BASE_URL}/bilder/sameAsPic/${nr}/${lastPicInfo.NR}`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Fehler beim Übernehmen")

      await reloadKategorien(lastPicInfo.NR)
      await loadBild(lastPicInfo.NR)
      setRefreshNeeded(true)
    } catch (err) {
      console.error("Fehler beim Übernehmen vom vorherigen Bild:", err)
    }
  }

  
  

  if (!bild) return null

  const isSuchTreffer = suchStore.results.some(b => b.NR === bild.NR)

  return (
<div className={`fixed inset-0 flex items-start justify-center z-[1000] pt-10 ${showVideoProjekt ? "backdrop-blur-sm bg-black/30" : "bg-black bg-opacity-60"}`} onClick={handleBackgroundClick}>
      <div
        ref={modalRef}
        className="bg-white p-6 rounded shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
     {(isChronoActive || isSuchTreffer) && (
  <div className="flex items-center justify-between gap-4 mt-2 text-sm w-full">
    
    {/* Zurück-Button */}
    {isChronoActive ? (
      <button
        onClick={() => handleChronoNavigation('prev')}
        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded whitespace-nowrap"
      >
        ◀ 
      </button>
    ) : (
      <div className="w-[120px]" /> // Platzhalter wenn der Button fehlt
    )}

    {/* Mittlerer Block: Checkbox + Select */}
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isChronoActive}
          onChange={(e) => setIsChronoActive(e.target.checked)}
        />
        Alle
      </label>

      {isChronoActive && (
        <select
          value={navigationMode}
          onChange={(e) =>
            setNavigationMode(e.target.value as 'Aufnahmedatum' | 'nr')
          }
          className="border px-2 py-1 text-sm rounded"
        >
          <option value="Aufnahmedatum">Aufnahmedatum</option>
          <option value="NR">Bildnummer</option>
        </select>
      )}
{bild.datum}
<BildLink url={bild.url} />
      {isSuchTreffer && (
        <div className="text-xs text-gray-500 italic" title="Bild in deiner Suche enthalten">
          🔎
        </div>
      )}
    </div>

    {/* Vor-Button */}
    {isChronoActive ? (
      <button
        onClick={() => handleChronoNavigation('next')}
        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded whitespace-nowrap"
      >
         ▶
      </button>
    ) : (
      <div className="w-[120px]" /> // Platzhalter wenn der Button fehlt
    )}
  </div>
)}
  {/* Bildanzeige – passt sich Quer- und Hochformat korrekt an */}
  <div className="w-full max-w-3xl mx-auto bg-gray-100 flex items-center justify-center overflow-hidden rounded">
  {bild.typ === "V"  ? (
  
      <video
          src={bild.url.replace("/images/", "/videos/")}
          controls
          autoPlay
          preload="auto"
          poster={bild.url}  // <<< HIER: Das Vorschaubild verwenden!
          className="w-full h-auto max-h-[768px] object-contain rounded"
      />
  ) : (
    <img
      src={bild.url}
      alt={bild.titel}
      onClick={() => {
        setAnsichtModus((prev) =>
          prev === "normal" ? "exif" : prev === "exif" ? "llm" : "normal"
        )
      }}
      className="w-full h-auto max-h-[768px] object-contain cursor-pointer"
    />
  )}
</div>
{bild.typ === "V" && (
  <button
    onClick={() => setShowVideoProjekt(true)}
    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
 >
    🎬 Details & Kapitel anzeigen
  </button>
)}

{/* Zusatzinfos: EXIF oder LLM */}
{ansichtModus === "exif" && <><br></br><ExifInfo bildNr={bild.NR} /></>}
{ansichtModus === "llm" && <><br></br><LlmInfo bildNr={bild.NR} /></>}


        {/* Eingabefelder */}
        <div className="flex items-start gap-2">
          <label className="w-24 font-medium pt-1">Titel:</label>
          <textarea
            className="w-full border px-2 py-1 rounded resize-none text-sm"
            rows={3}
            value={bild.titel}
            onChange={(e) => handleChange("titel", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-24 font-medium">Fotograf:</label>
          <input
            className="flex-1 border px-2 py-1 rounded"
            value={bild.fotograf}
            onChange={(e) => handleChange("fotograf", e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label className="w-24 font-medium">Kamera:</label>
          <input
            className="flex-1 border px-2 py-1 rounded"
            value={bild.kamera}
            onChange={(e) => handleChange("kamera", e.target.value)}
          />
        </div>

        

       
        {/* Kategorien */}
        {kategorien.length > 0 && (
          <div className="flex flex-wrap gap-2 max-h-24 overflow-auto text-xs">
            {kategorien.map((kat) => (
              <span
                key={kat.id}
                onDoubleClick={() => handleKategorieEntfernen(kat.id)}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer hover:bg-red-100"
                title="Doppelklick zum Entfernen"
              >
                {kat.bezeichnung}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <label className="w-24 font-medium">weitere Kategorien:</label>
          <KategorieCombobox
            kategorien={kategorieStore.kategorien}
            selected={""}
            onChange={(val) => handleKategorieHinzufuegen(val)}
          />
        </div>
        <hr></hr>
        {/* Vorschläge */}
        {vorgeschlageneKategorien.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs">
            {vorgeschlageneKategorien.map((kat) => (
              <span
                key={kat.id}
                onDoubleClick={async () => {
                  await handleKategorieHinzufuegen(kat.id)
                  setVorgeschlageneKategorien((prev) => prev.filter((k) => k.id !== kat.id))
                }}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded cursor-pointer hover:bg-green-100"
                title={kat.beschreibung}
              >
                {kat.bezeichnung}
              </span>
            ))}
          </div>
        )}


        {/* Übernehmen vom vorherigen Bild */}
        {lastPicInfo && (

          <div
            className="bg-yellow-100 border border-yellow-400 rounded px-3 py-2 text-sm cursor-pointer hover:bg-yellow-200 relative group select-none"
            onDoubleClick={handleSameAsLastPic}
          >
            Übernehmen von vorherigem Bild
            <div className="absolute left-0 bottom-full mb-1 w-max max-w-sm bg-gray-800 text-white text-xs rounded px-2 py-1 hidden group-hover:block transition-opacity z-10">
  {lastPicInfo.info}
</div>
            
          </div>
        )}

{/* Spezielle Video-Zusatz-Anzeigen */}
{showVideoProjekt && (
  <div className="fixed inset-0 bg-black bg-opacity-80 z-[1100] flex items-center justify-center">
    <div className="relative bg-white w-full h-full overflow-auto p-6 rounded-none shadow-none">
      <button
        onClick={() => setShowVideoProjekt(false)}
        className="absolute top-4 right-4 text-gray-600 hover:text-black text-3xl font-bold z-10"
        >
        &times;
      </button>

      <VideoProjekt bildNr={bild.NR} />
    </div>
  </div>
)}



        


      </div>
    </div>
  )
}