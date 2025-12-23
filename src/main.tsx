/** biome-ignore-all lint/style/noNonNullAssertion: document root*/
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/global.css'
import { RouterProvider } from 'react-router'
import router from './routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
