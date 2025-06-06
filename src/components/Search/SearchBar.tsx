import React, { useEffect, useState } from 'react'
import './SearchBar.css'
import logoBanner from '../../assets/dubvsubbanner.webp'
import icon from '../../assets/dubvsubicon.webp'
import { useParams } from 'react-router'

interface SearchProps {
    setIsTop: boolean
}

export const Search: React.FC<SearchProps> = ({ setIsTop }) => {
    const { id } = useParams()
    const [searchInput, setSearchInput] = useState('')

    const search = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        window.location.href = `/search?q=${encodeURI(searchInput)}`
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
                <form
                    onSubmit={search}
                    role="search"
                    className="search-bar"
                    data-testid="searchBar"
                >
                    <label htmlFor="search">Search</label>
                    <input
                        id="search"
                        data-testid="searchField"
                        type="search"
                        placeholder="Search for anime..."
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                        required
                    />
                    <button
                        type="submit"
                        className="search-button"
                        data-testid="searchButton"
                    >
                        Search
                    </button>
                </form>
            </div>
        </div>
    )
}
