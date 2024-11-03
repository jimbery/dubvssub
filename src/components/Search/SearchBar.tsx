import React, { useEffect, useState } from 'react'
import './SearchBar.css'
import logoBanner from './Logo.bmp'
import icon from './icon3.bmp'
import { useParams } from 'react-router'

interface SearchProps {
    setIsTop: boolean
}

export const Search: React.FC<SearchProps> = ({ setIsTop }) => {
    const { id } = useParams() // Get the anime ID from the URL
    const [searchInput, setSearchInput] = useState('')

    const search = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Redirect to the search results page
        window.location.href = `/search?q=${searchInput}`
    }

    useEffect(() => {
        if (id) {
        }
    }, [id])

    return (
        <div className="input-wrapper">
            <div className={`centered-container ${setIsTop ? 'top' : ''}`}>
                <div className="logo">
                    <a href="/" aria-label="Home">
                        <img
                            src={setIsTop ? icon : logoBanner}
                            alt="Logo"
                            className={setIsTop ? 'icon' : 'banner'}
                        />
                    </a>
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
        </div>
    )
}
