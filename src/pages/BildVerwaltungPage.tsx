import { observer } from 'mobx-react-lite'
import suchStore from '../store/SuchStore'
import SuchErgebnisseView from '../views/SuchErgebnisseView'

const BildVerwaltungPage = observer(() => {
  const { results } = suchStore

  return (
    <div className="flex">
      <main className="flex-1 p-4">
        {results.length > 0 ? (
          <SuchErgebnisseView results={results} />
        ) : (
          <p className="text-gray-500">Bitte eine Aktion im Menü wählen oder eine Suche durchführen.</p>
        )}
      </main>
    </div>
  )
})

export default BildVerwaltungPage