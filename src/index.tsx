import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom'
import './index.css'
import Home from './pages/home'
import SearchPage from './pages/search'
import AnimePage from './pages/anime'
import ReactGA from 'react-ga4'

ReactGA.initialize('G-YC7GN03HQ7')

document.title = 'Dub vs Sub'

const rootElement = document.getElementById('root')

// Track page views on route change
function AnalyticsListener() {
    const location = useLocation()
    React.useEffect(() => {
        ReactGA.send({
            hitType: 'pageview',
            page: location.pathname + location.search,
        })
    }, [location])
    return null
}

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <React.StrictMode>
            <Router>
                <AnalyticsListener />
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
