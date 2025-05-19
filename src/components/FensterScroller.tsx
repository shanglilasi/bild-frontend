// 4. Scroll-Umschalter (optional)
// src/components/FensterScroller.tsx
import { observer } from "mobx-react-lite"
import { useStore } from "../store/StoreContext"
import type { Zusatzfenster } from "../store/UiStore"

export const FensterScroller = observer(() => {
  const { uiStore } = useStore()
  if (uiStore.windows.length <= 1) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white rounded shadow-lg px-3 py-1 flex gap-2 z-[3000]">
      {uiStore.windows.map((w) => (
        <button
          key={w.id}
          onClick={() => uiStore.bringToFront(w.id)}
          className="px-2 py-1 text-xs hover:bg-gray-600 rounded"
        >
          {w.id}
        </button>
      ))}
    </div>
  )
})

