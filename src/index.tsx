import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { Search } from './components/Search/SearchBar'
import { Anime } from './components/Anime/Anime'

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
                    <Route path="/" element={<Search />} />
                    <Route path="/anime/:id" element={<Anime />} />
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
