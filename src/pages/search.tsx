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

            if (res instanceof Error)
                throw new Error('error getting search data')
            if (!res.Data) throw new Error('no search results returned')
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
        if (searchTerm) {
            handleSearch(searchTerm)
        }
    }, [location.search])

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
