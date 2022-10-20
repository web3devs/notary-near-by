import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { Buffer } from 'buffer'

window.Buffer = Buffer

import 'primeflex/primeflex.css'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
