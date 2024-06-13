import React, { useEffect, useState } from 'react'
import './SearchBar.css'
import GetSearchAnime, {
    GetSearchAnimeOutput,
} from '../../routes/GetSearchAnime'

export const Search = () => {
    const [searchInput, setSearchInput] = useState('')
    const [searchResults, setSearchResults] = useState<
        GetSearchAnimeOutput['Data']
    >([])

    useEffect(() => {}, [searchInput])

    const search = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = await GetSearchAnime(searchInput)
        if (data instanceof Error) {
            console.error('Error fetching data:', data)
            return
        }

        try {
            const data = await GetSearchAnime(searchInput)
            if (data instanceof Error) return data
            console.log(data)
            setSearchResults(data.Data)
        } catch (err) {
            return err
        }
    }

    return (
        <div className="input-wrapper">
            <form onSubmit={search}>
                <input
                    placeholder="Enter Post Title..."
                    onChange={(e) => setSearchInput(e.target.value)}
                    value={searchInput}
                />
                <button type="submit" data-testid="searchSubmitButton">
                    Search
                </button>
            </form>
            <div className="results">
                results:
                {searchResults && searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                        <div key={index}>{JSON.stringify(result.Title)}\n</div>
                    ))
                ) : (
                    <div>No results found</div>
                )}
            </div>
        </div>
    )
}
