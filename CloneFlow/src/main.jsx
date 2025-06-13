import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import HomePage from './component/HomePage.jsx'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
// import './component/HomePage.css'
const router = createBrowserRouter([
  {path: '/home', element: <HomePage />},
  {path: '/', element: <App/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
