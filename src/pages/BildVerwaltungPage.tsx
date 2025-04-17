// src/pages/BildVerwaltungPage.tsx
import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'
import SuchErgebnisseView from '../views/SuchErgebnisseView'

const BildVerwaltungPage = observer(() => {
  const { suchStore } = useStore()
  const { results } = suchStore

  return (
    <div className="flex">
      <main className="flex-1 p-4 space-y-4">
        {results.length > 0 && (
          <p className="text-sm text-gray-600">
            {results.length} Treffer gefunden.
          </p>
        )}
        <SuchErgebnisseView />
      </main>
    </div>
  )


})

export default BildVerwaltungPage