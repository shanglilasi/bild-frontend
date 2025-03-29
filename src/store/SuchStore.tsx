// === store/SuchStore.ts ===
import { makeAutoObservable } from 'mobx'

export interface Suchwerte {
  text: string
  von: string
  bis: string
  typ: string
  kategorie: string
  kamera: string
}

class SuchStore {
  values: Suchwerte = {
    text: '',
    von: '',
    bis: '',
    typ: 'Bilder',
    kategorie: '',
    kamera: '',
  }

  results: any[] = []

  constructor() {
    makeAutoObservable(this)
  }

  setValues(values: Partial<Suchwerte>) {
    this.values = { ...this.values, ...values }
  }

  setResults(results: any[]) {
    this.results = results
  }

  search() {
    // Für Demo-Zwecke: Dummy-Daten als Ergebnis
    this.setResults([
      { titel: 'Beispielbild 1', url: 'https://via.placeholder.com/150' },
      { titel: 'Beispielbild 2', url: 'https://via.placeholder.com/150' },
    ])
  }
}

const suchStore = new SuchStore()
export default suchStore
