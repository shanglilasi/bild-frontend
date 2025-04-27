// src/pages/DatenbankAbfragePage.tsx

import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'
import FolderTable from '../components/FolderTable'

const DatenbankAbfragePage = observer(() => {
  const { suchStore } = useStore()
  const { verwaltungTab } = suchStore

  return (
    <div className="p-4 space-y-4">
      {verwaltungTab === 'ordner' && <FolderTable />}
      {verwaltungTab === 'bilder' && (
        <div>
          <h2 className="text-lg font-semibold mb-2">🖼️ Bilder</h2>
          <p>Hier wird später die Bilderübersicht erscheinen.</p>
        </div>
      )}
      {verwaltungTab === 'reports' && (
        <div>
          <h2 className="text-lg font-semibold mb-2">📊 Reports</h2>
          <p>Hier kommen Auswertungen und Statistiken.</p>
        </div>
      )}
    </div>
  )
})

export default DatenbankAbfragePage