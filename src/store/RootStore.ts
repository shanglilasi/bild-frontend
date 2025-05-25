import { types, flow, Instance, cast,clone } from "mobx-state-tree"
import type { BildData } from '../types/Bild'
import { BASE_URL } from '../config'
import { apiFetch } from "../util/api"
// ======================
// 📦 Modelle
// ======================

const Person = types.model({
  id: types.number,
  name: types.string,
  geb_dat: types.maybeNull(types.string),
  geb_name: types.maybeNull(types.string),
  geschlecht: types.maybeNull(types.string),
  geburtsjahr: types.maybeNull(types.string),
  beruf: types.maybeNull(types.string),
  notizen: types.maybeNull(types.string),
})

const Suchwerte = types.model({
  text: types.string,
  von: types.string,
  bis: types.string,
  typ: types.string,
  kategorie: types.union(types.string, types.number),
  kamera: types.string,
  fotograf: types.string,
})

const Bild = types.model({
  NR: types.number,
  datei: types.string,
  titel: types.string,
  datum: types.string,
  kamera: types.string,
  url: types.string,
  typ: types.string,
  kategorie: types.optional(types.string, ""),
  fotograf: types.string,
})

const Kategorie = types.model({
  id: types.identifierNumber,
  bezeichnung: types.string,
  beschreibung: types.string,
  kattyp: types.string,
  ober: types.maybeNull(types.number),
  hidden: types.number,
})

const Kamera = types.model({
  name: types.string,
})

const Fotograf = types.model({
  name: types.string,
})

const FamilienStore = types
  .model("FamilienStore", {
    treffer: types.array(Person),
    selected: types.maybeNull(Person), // 🧠 aktuell ausgewählte Person
  })
  .actions((self) => ({
    search: flow(function* (query: string) {
      try {
        const res = yield apiFetch(`${BASE_URL}/ahnen/suche/${encodeURIComponent(query)}`)
        const data = yield res.json()
        self.treffer = data
      } catch (err) {
        console.error("Familiensuche fehlgeschlagen", err)
      }
    }),
    selectPerson(person: any) {
      self.selected = clone(person) // wichtig: clone() erzeugt einen MobX-kompatiblen Wert
    },
  }))

// ======================
// 🔐 AuthStore
// ======================

const AuthStore = types
  .model("AuthStore", {
    isAuthenticated: types.boolean,
    username: types.string,
    isLoading: types.boolean,
  })
  .actions((self) => ({
    login(username: string) {
      self.isAuthenticated = true
      self.username = username
    },
    logout: flow(function* () {
      try {
        yield apiFetch('/login/logout', {
          method: 'GET',
          credentials: 'include',
        })
      } catch (e) {
        console.error("Fehler beim Logout:", e)
      }
      self.isAuthenticated = false
      self.username = ""
      window.location.href = "/login"
    }),
    checkSession: flow(function* () {
      self.isLoading = true
      try {
        const res = yield apiFetch('/login/status', {
          method: 'GET',
          credentials: 'include',
        })
        const data = yield res.json()
        self.isAuthenticated = data.loggedIn
        self.username = data.user || ''
      } catch {
        self.isAuthenticated = false
        self.username = ''
      } finally {
        self.isLoading = false
      }
    }),
  }))

// ======================
// 🔄 Helper
// ======================

function transformBackendBild(item: any): BildData {
  const pfad = (item.pfad ?? '').replace(/\\/g, '/').replace(/\/+/g, '/')
  const datei = (item.datei ?? '').replace(/\\/g, '/')
  return {
    NR: item.NR,
    titel: item.STICHWORTE ?? '',
    datei: item.datei ?? '',
    datum: item.AUFNAHMEDATUM ?? '',
    kamera: item.kamera ?? '',
    typ: item.typ ?? '',
    url: pfad && datei ? `${BASE_URL}/utils/images/${pfad}/${datei}` : '',
    kategorie: item.kategorie ?? '',
    fotograf: item.fotograf ?? '',
  }
}

// ======================
// 🔍 SuchStore
// ======================

const SuchStore = types
  .model("SuchStore", {
    values: Suchwerte,
    results: types.array(Bild),
    sortField: types.string,
    sortOrder: types.enumeration(["asc", "desc"]),
    activeFilters: types.model({
      kamera: types.string,
      kategorie: types.string,
    }),
    verwaltungTab: types.enumeration(["ordner", "videoeditor", "bilder", "reports"]),
  })
  .actions((self) => ({
    setValues(values: Partial<typeof self.values>) {
      self.values = { ...self.values, ...values }
    },
    setResults(results: any[]) {
      self.results = cast(results)
    },
    setSort(field: string) {
      if (self.sortField === field) {
        self.sortOrder = self.sortOrder === "asc" ? "desc" : "asc"
      } else {
        self.sortField = field
        self.sortOrder = "asc"
      }
    },
    setFilter(name: "kamera" | "kategorie", value: string) {
      self.activeFilters[name] = value
    },
    setVerwaltungTab(tab: "ordner" | "bilder" | "reports" | "videoeditor") {
      self.verwaltungTab = tab
    },
    updateBild(updatedBild: BildData) {
      const index = self.results.findIndex((b) => b.NR === updatedBild.NR)
      if (index >= 0) {
        self.results[index] = updatedBild as any
      }
    },
    search: flow(function* (values) {
      try {
        const res = yield apiFetch(`${BASE_URL}/bilder/bilder`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: values.text,
            datum_von: values.von,
            datum_bis: values.bis,
            kamera: values.kamera,
            typ: values.typ,
            kategorie: values.kategorie,
            fotograf: values.fotograf,
            noKategorie: values.noKategorie,
            noTitle: values.noTitle,
          }),
        })

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)
        const data = yield res.json()
        const transformed = data.map(transformBackendBild)
        self.results = transformed
      } catch (err) {
        console.error("Fehler bei der Suche:", err)
      }
    }),
  }))
  .views((self) => ({
    get filteredResults() {
      return self.results.filter((item) => {
        const kameraOk = self.activeFilters.kamera ? item.kamera === self.activeFilters.kamera : true
        const kategorieOk = self.activeFilters.kategorie ? item.kategorie === self.activeFilters.kategorie : true
        return kameraOk && kategorieOk
      })
    },
  }))

// ======================
// 🗂️ KategorieStore
// ======================

const KategorieStore = types
  .model("KategorieStore", {
    kategorien: types.array(Kategorie),
    kameras: types.array(Kamera),
    fotografen: types.array(Fotograf),
    loading: types.boolean,
    error: types.maybeNull(types.string),
    kamerasLoading: types.boolean,
    kamerasError: types.maybeNull(types.string),
    fotografenLoading: types.boolean,
    fotografenError: types.maybeNull(types.string),
  })
  .actions((self) => ({
    loadKategorien: flow(function* () {
      self.loading = true
      self.error = null
      try {
        const res = yield apiFetch(`${BASE_URL}/kategorien/kategorie`)
        const data = yield res.json()
        self.kategorien = cast(data.map((item: any) => ({
          id: Number(item.id),
          bezeichnung: item.bezeichnung ?? '',
          beschreibung: item.beschreibung ?? '',
          kattyp: item.kattyp ?? '',
          ober: item.ober ?? null,
          hidden: item.hidden ?? 0,
        })))
        self.loading = false
      } catch (err: any) {
        self.error = err.message
        self.loading = false
      }
    }),
    loadKameras: flow(function* () {
      self.kamerasLoading = true
      self.kamerasError = null
      try {
        const res = yield apiFetch(`${BASE_URL}/utils/kamera`)
        const data = yield res.json()
        self.kameras = data
        self.kamerasLoading = false
      } catch (err: any) {
        self.kamerasError = err.message
        self.kamerasLoading = false
      }
    }),
    loadFotografen: flow(function* () {
      self.fotografenLoading = true
      self.fotografenError = null
      try {
        const res = yield apiFetch(`${BASE_URL}/utils/fotografen`)
        const data = yield res.json()
        self.fotografen = data
        self.fotografenLoading = false
      } catch (err: any) {
        self.fotografenError = err.message
        self.fotografenLoading = false
      }
    }),
  }))

// ======================
// 🧠 RootStore
// ======================

export const RootStore = types.model({
  authStore: AuthStore,
  suchStore: SuchStore,
  kategorieStore: KategorieStore,
  familienStore: FamilienStore,
})

// ======================
// 🧪 createRootStore
// ======================

export const createRootStore = () => {
  const mstStore = RootStore.create({
    authStore: {
      isAuthenticated: false,
      username: "",
      isLoading: true,
    },
    suchStore: {
      values: {
        text: "",
        von: "",
        bis: "",
        typ: "",
        kategorie: "",
        kamera: "",
        fotograf: "",
      },
      results: [],
      sortField: "datum",
      sortOrder: "desc",
      activeFilters: {
        kamera: "",
        kategorie: "",
      },
      verwaltungTab: "ordner",
    },
    kategorieStore: {
      kategorien: [],
      kameras: [],
      fotografen: [],
      loading: false,
      error: null,
      kamerasLoading: false,
      kamerasError: null,
      fotografenLoading: false,
      fotografenError: null,
    },
    
    familienStore: {
  treffer: [],
  selected: null,
}
    
    
    
    ,
  })

  return mstStore
}

// ======================
// 📌 Typ für Context
// ======================

export interface IRootStore extends Instance<typeof RootStore> {}