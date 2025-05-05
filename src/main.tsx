// main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { createRootStore } from './store/RootStore'
import { StoreContext } from './store/StoreContext' // <-- wichtig

const rootStore = createRootStore()
rootStore.authStore.checkSession()


rootStore.authStore.checkSession().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <StoreContext.Provider value={rootStore}>
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </StoreContext.Provider>
    </React.StrictMode>
  )
})