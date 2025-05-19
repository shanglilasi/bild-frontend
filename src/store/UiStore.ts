// src/store/UiStore.ts
import { makeAutoObservable } from "mobx"
import type { JSX } from "react" // <-- wichtig für JSX.Element
export class Zusatzfenster {
  id: string
  component: () => JSX.Element
  position: { x: number; y: number }
  zIndex: number

  constructor(id: string, component: () => JSX.Element, position = { x: 100, y: 100 }, zIndex = 1000) {
    this.id = id
    this.component = component
    this.position = position
    this.zIndex = zIndex

    makeAutoObservable(this)
  }
}

export class UiStore {
  windows: Zusatzfenster[] = []

  constructor() {
    makeAutoObservable(this)
  }

  /**
   * Öffnet ein neues Fenster
   */
  addWindow(window: Zusatzfenster) {
    this.windows.push(window)
  }

  /**
   * Schließt ein Fenster anhand seiner ID
   */
  closeWindow(id: string) {
    this.windows = this.windows.filter((w) => w.id !== id)
  }

  /**
   * Bringt ein Fenster in den Vordergrund
   */
  bringToFront(id: string) {
    const maxZ = Math.max(1000, ...this.windows.map((w) => w.zIndex))
    const fenster = this.windows.find((w) => w.id === id)
    if (fenster) fenster.zIndex = maxZ + 1
  }

  /**
   * Verschiebt ein Fenster auf eine neue Position
   */
  moveWindow(id: string, x: number, y: number) {
    const fenster = this.windows.find((w) => w.id === id)
    if (fenster) {
      fenster.position = { x, y }
    }
  }

  /**
   * Überprüft, ob ein Fenster mit einer bestimmten ID bereits existiert
   */
  hasWindow(id: string) {
    return this.windows.some((w) => w.id === id)
  }
}