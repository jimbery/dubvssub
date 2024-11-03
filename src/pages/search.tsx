import React, { useEffect, useState } from 'react'
import { Search } from '../components/Search/SearchBar' // Adjust path as necessary
import GetSearchAnime, { GetSearchAnimeOutput } from '../routes/GetSearchAnime'
import Results from '../components/Results/Results'
import { useLocation } from 'react-router'

const SearchPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [results, setResults] = useState<GetSearchAnimeOutput['Data']>()

    const location = useLocation()

    // Update the type according to your expected API response
    const handleSearch = async (searchTerm: string): Promise<void> => {
        setLoading(true)
        setError('')

        try {
            const res: GetSearchAnimeOutput | Error =
                await GetSearchAnime(searchTerm)
            console.log(res)
            if (res instanceof Error) throw new Error('')
            if (!res.Data) throw new Error('')
            setResults(res.Data)
        } catch (err) {
            setError('Error fetching results')
        } finally {
            setLoading(false)
        }
    }

    const getQueryParameter = (param: string) => {
        const params = new URLSearchParams(location.search)
        return params.get(param)
    }

    useEffect(() => {
        const searchTerm = getQueryParameter('q')
        console.log(searchTerm) // Get the search term from the query string
        if (searchTerm) {
            handleSearch(searchTerm) // Call handleSearch with the search term
        }
    }, [location.search]) // Run effect when location.search changes

    return (
        <>
            <Search setIsTop={true}></Search>
            <Results
                searchResults={results}
                hasSearched={!!results}
                loading={loading}
                error={error}
            ></Results>
        </>
    )
}

export default SearchPage
