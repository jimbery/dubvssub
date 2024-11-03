import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { Anime } from './components/Anime/Anime'
import Home from './pages/home'
import SearchPage from './pages/search'

// Set the document title
document.title = 'DubVsSub'

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
