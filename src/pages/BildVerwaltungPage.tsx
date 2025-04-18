// src/pages/BildVerwaltungPage.tsx
import { observer } from 'mobx-react-lite'
import SuchErgebnisseView from '../views/SuchErgebnisseView'
const BildVerwaltungPage = observer(() => {
  return (
    <div className="flex">
      <main className="flex-1 p-4 space-y-4">
        <SuchErgebnisseView />
      </main>
    </div>
  )
})

export default BildVerwaltungPage