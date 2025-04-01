import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import { Anime } from './components/Anime/Anime'
import Home from './pages/home'
import SearchPage from './pages/search'

// Set the document title
document.title = 'Dub vs Sub'

const rootElement = document.getElementById('root')

// Ensure rootElement is not null
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/anime/:id" element={<Anime />} />
                    {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
                </Routes>
            </Router>
        </React.StrictMode>,
    )
} else {
    console.error('Root element not found.')
}
