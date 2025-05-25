import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/home'
import SearchPage from './pages/search'
import AnimePage from './pages/anime'

document.title = 'Dub vs Sub'

const rootElement = document.getElementById('root')

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/anime/:id" element={<AnimePage />} />
                </Routes>
            </Router>
        </React.StrictMode>,
    )
} else {
    console.error('Root element not found.')
}
