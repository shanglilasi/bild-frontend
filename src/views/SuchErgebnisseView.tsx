// src/views/SuchErgebnisseView.tsx

import { observer } from "mobx-react-lite"
import { useStore } from "../store/StoreContext"
import PIC from "../components/subBilder/PIC"
import { useEffect, useRef, useState } from "react"

const SuchErgebnisseView = observer(() => {
  const { suchStore } = useStore()

  const {
    filteredResults,
    sortField,
    sortOrder,
    setSort,
    setFilter,
    activeFilters,
  } = suchStore

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastScrollTop = useRef(0)
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const currentScroll = container.scrollTop
      if (currentScroll > lastScrollTop.current + 10) {
        setShowFilters(false) // nach unten scrollen
      } else if (currentScroll < lastScrollTop.current - 10) {
        setShowFilters(true) // nach oben scrollen
      }
      lastScrollTop.current = currentScroll
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const sorted = [...filteredResults].sort((a, b) => {
    let valA = a[sortField as keyof typeof a]
    let valB = b[sortField as keyof typeof b]

    if (valA == null) valA = ""
    if (valB == null) valB = ""

    if (sortField === "datum") {
      return sortOrder === "asc"
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString())
    }

    const strA = valA.toString().toLowerCase()
    const strB = valB.toString().toLowerCase()

    if (strA < strB) return sortOrder === "asc" ? -1 : 1
    if (strA > strB) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const uniqueCameras = Array.from(
    new Set(filteredResults.map((bild) => bild.kamera))
  ).sort()

  return (
    <div
      ref={scrollContainerRef}
      className="relative max-h-[calc(100vh-100px)] overflow-y-auto"
    >
      {/* Filter & Sort UI (ein-/ausblendbar) */}
      <div
        className={`sticky top-0 z-10 bg-white transition-all duration-300 ${
          showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-wrap gap-4 mb-4 items-center p-2 border-b bg-white shadow">
          {["datum", "titel",  "kamera", "fotograf"].map((field) => (
            <button
              key={field}
              onClick={() => setSort(field)}
              className={`text-sm px-2 py-1 rounded border ${
                sortField === field ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {field}{" "}
              {sortField === field
                ? sortOrder === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </button>
          ))}

          <select
            value={activeFilters.kamera}
            onChange={(e) => setFilter("kamera", e.target.value)}
            className="bg-white border rounded px-3 py-2 text-sm"
          >
            <option value="">Alle Kameras</option>
            {uniqueCameras.map((kamera) => (
              <option key={kamera} value={kamera}>
                {kamera}
              </option>
            ))}
          </select>

         
        </div>
      </div>

      {/* Ergebnis-Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2">
        {sorted.map((bild) => (
          <PIC key={bild.NR} data={bild} />
        ))}
      </div>
    </div>
  )
})

export default SuchErgebnisseView