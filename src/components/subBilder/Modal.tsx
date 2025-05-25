// src/components/subBilder/Modal.tsx
import { ReactNode, useEffect } from "react"
import ReactDOM from "react-dom"

export default function Modal({
  onClose,
  children,
}: {
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 z-[9999] flex justify-end">
      <div className="w-3/4 h-full bg-white shadow-lg overflow-auto relative">

        {/* Sticky Header mit Schließen */}
        <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-2 border-b shadow">
          <h2 className="text-lg font-bold text-gray-800">Alle Kategorien</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Scrollbarer Hauptinhalt */}
        <div className="p-4">
          {children}
        </div>
        
      </div>
    </div>,
    document.body
  )
}