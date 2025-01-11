import React, { useEffect, useState } from 'react'
import './SearchBar.css'
import logoBanner from '../../assets/dubvsubbanner.bmp'
import icon from '../../assets/dubvsubicon.bmp'
import { useParams } from 'react-router'

interface SearchProps {
    setIsTop: boolean
}

export const Search: React.FC<SearchProps> = ({ setIsTop }) => {
    // Get the anime ID from the URL
    const { id } = useParams()
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
                            data-testid="dubVsSubBannerIcon"
                        />
                    </a>
                </div>

                {/* Search Bar Section */}
                <form onSubmit={search} role="search" className="search-bar">
                    <label htmlFor="search">Search</label>
                    <input
                        id="search"
                        data-testid="search"
                        type="search"
                        placeholder="Search for anime..."
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                        required
                    />
                    <button type="submit" data-testid="searchButton">
                        Search
                    </button>
                </form>
            </div>
        </div>
    )
}
