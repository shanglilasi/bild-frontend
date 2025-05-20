// src/types/Kategorie.ts

export interface Kategorie {
    id: number
    bezeichnung: string
    beschreibung: string
    kattyp: string
    ober: number | null
    hidden: number
  }