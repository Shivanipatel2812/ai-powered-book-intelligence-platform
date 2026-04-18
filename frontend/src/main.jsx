import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import BookDetail from './BookDetail.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/book/:id" element={<BookDetail />} />
    </Routes>
  </BrowserRouter>
)