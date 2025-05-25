// src/views/BrowserView.tsx
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'
import SlideshowController from '../components/subBilder/SlideshowController'

const BrowserView = observer(() => {
  const { suchStore } = useStore()
  const bilder = suchStore.results

  if (!bilder.length) {
    return <p className="text-gray-500">Keine Bilder gefunden oder noch nicht geladen.</p>
  }

  return <SlideshowController />
})

export default BrowserView