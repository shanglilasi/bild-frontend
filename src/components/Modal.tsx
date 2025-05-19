// src/components/Modal.tsx
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
      <div className="w-3/4 h-full bg-white shadow-lg p-4 overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-600 text-2xl font-bold"
        >
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}