import { observer } from 'mobx-react-lite'
import { useStore } from '../store/StoreContext'

import KategorieListe from '../components/Kategorieliste'



const KategorieManagerView: React.FC = observer(() => {
  const { kategorieStore } = useStore()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-800">Kategorien verwalten</h2>
      <KategorieListe kategorien={kategorieStore.kategorien} />
    </div>
  )
})

export default KategorieManagerView