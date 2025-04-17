// src/store/StoreContext.ts
import React from 'react'
import { IRootStore } from './RootStore'

export const StoreContext = React.createContext<IRootStore | null>(null)

export const useStore = (): IRootStore => {
  const store = React.useContext(StoreContext)
  if (!store) {
    throw new Error('StoreContext is not provided')
  }
  return store
}