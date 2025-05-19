// src/components/VerschiebbaresFenster.tsx

import { useStore } from "../store/StoreContext"
import { Zusatzfenster } from "../store/UiStore"

export function VerschiebbaresFenster({ fenster }: { fenster: Zusatzfenster }) {
  const { uiStore } = useStore()

  return (
    <div
      style={{
        right: 0,
        top: 0,
        width: '75vw',
        height: '100vh',
        zIndex: fenster.zIndex,
      }}
      className="fixed bg-white border-l border-gray-300 shadow-lg flex flex-col"
    >
      {/* Kopfzeile mit Schließen */}
      <div className="bg-gray-200 text-sm font-semibold p-2 border-b flex justify-between items-center">
        <span>{fenster.id}</span>
        <button
          onClick={() => uiStore.closeWindow(fenster.id)}
          className="text-red-500 font-bold"
        >
          ×
        </button>
      </div>

      {/* Scrollbarer Inhalt */}
      <div className="p-4 overflow-auto flex-1 bg-white">
        {fenster.component()}
      </div>
    </div>
  )
}