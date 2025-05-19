// 3. Container-Komponente
// src/components/FensterContainer.tsx
import { observer } from "mobx-react-lite"
import { useStore } from "../store/StoreContext"
import { VerschiebbaresFenster } from "./VerschiebbaresFenster"
import { createPortal } from "react-dom"

export const FensterContainer = observer(() => {
  const { uiStore } = useStore()
  const sorted = [...uiStore.windows].sort((a, b) => a.zIndex - b.zIndex)
  if (!sorted.length) return null

  return createPortal(
    <>{sorted.map((w) => <VerschiebbaresFenster key={w.id} fenster={w} />)}</>,
    document.getElementById("global-overlay-root")!
  )
})

