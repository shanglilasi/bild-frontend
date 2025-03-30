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
  sortField: string = 'titel'
  sortOrder: 'asc' | 'desc' = 'asc'

  activeFilters = {
    kamera: '',
    kategorie: '',
  }

  view: string | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  setValues(values: Partial<Suchwerte>) {
    this.values = { ...this.values, ...values }
  }

  setResults(results: any[]) {
    this.results = results
  }

  setSort(field: string) {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
    } else {
      this.sortField = field
      this.sortOrder = 'asc'
    }
  }

  setFilter(name: 'kamera' | 'kategorie', value: string) {
    this.activeFilters = {
      ...this.activeFilters,
      [name]: value,
    }
  }

  setView(view: string | null) {
    this.view = view
  }

  get filteredResults() {
    return this.results.filter((item) => {
      const kameraOk = this.activeFilters.kamera
        ? item.kamera === this.activeFilters.kamera
        : true
      const kategorieOk = this.activeFilters.kategorie
        ? item.kategorie === this.activeFilters.kategorie
        : true
      return kameraOk && kategorieOk
    })
  }

  loadTestdaten() {
    const kameras = ['Canon', 'Nikon', 'Sony']
    const kategorien = ['Natur', 'Technik', 'Tiere']
    const today = new Date()

    const testdaten = Array.from({ length: 200 }, (_, i) => {
      const tag = new Date(today)
      tag.setDate(today.getDate() - i)

      return {
        titel: `Bild ${i + 1}`,
        datum: tag.toISOString().split('T')[0],
        kamera: kameras[i % kameras.length],
        kategorie: kategorien[i % kategorien.length],
        url: `https://picsum.photos/seed/testbild-${i}/300/200`,
      }
    })

    this.setResults(testdaten)
  }

  async loadFromBackend() {
    try {
      const res = await fetch('http://localhost:8080/allPic')
      const data = await res.json()
      this.setResults(data)
    } catch (err) {
      console.error('Fehler beim Laden vom Backend:', err)
    }
  }
}

export default new SuchStore()