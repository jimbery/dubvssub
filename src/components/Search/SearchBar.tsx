// Search.tsx
import React, { useState } from 'react'
import './SearchBar.css'
import '../Results/Results.css'
import GetSearchAnime, {
    GetSearchAnimeOutput,
} from '../../routes/GetSearchAnime'
import logoBanner from './Logo.bmp'
import icon from './icon3.bmp'
import Results from '../Results/Results' // Import the Results component

export const Search = () => {
    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState<
        GetSearchAnimeOutput['Data']
    >([])
    const [error, setError] = useState('')
    const [isTop, setIsTop] = useState(false)
    const [hasSearched, setHasSearched] = useState(false) // New state variable

    const search = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setHasSearched(true) // Mark that a search has been attempted
        setIsTop(true)

        try {
            const data = await GetSearchAnime(searchInput)
            if (data instanceof Error || !data.Data) {
                setError(data instanceof Error ? data.message : 'No data found')
                return
            } else {
                setError('')
                setSearchResults(data.Data)
            }
            setIsTop(true)
        } catch (err) {
            // Catch any unexpected errors in the request
            setIsTop(true)
            setError('An unexpected error occurred.')
        }
    }

    return (
        <div className="input-wrapper">
            <div className={`centered-container ${isTop ? 'top' : ''}`}>
                <div className="logo">
                    <img
                        src={isTop ? icon : logoBanner}
                        alt="Logo"
                        className={isTop ? 'icon' : 'banner'}
                    />
                </div>

                {/* Search Bar Section */}
                <form onSubmit={search} role="search" className="search-bar">
                    <label htmlFor="search">Search</label>
                    <input
                        id="search"
                        type="search"
                        placeholder="Enter Post Title..."
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                        required
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            {/* Results Section */}
            <Results
                searchResults={searchResults}
                hasSearched={hasSearched}
                error={error}
            />
        </div>
    )
}
