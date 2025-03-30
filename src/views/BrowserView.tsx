import { observer } from 'mobx-react-lite'
import suchStore from '../store/SuchStore'
import PIC from '../components/PIC'

const BrowserView = observer(() => {
  const bilder = suchStore.results

  if (!bilder.length) {
    return <p className="text-gray-500">Keine Bilder gefunden oder noch nicht geladen.</p>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {bilder.map((bild, i) => (
        <PIC key={i} data={bild} />
      ))}
    </div>
  )
})

export default BrowserView