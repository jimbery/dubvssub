import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation } from 'react-router'
import { Search } from '../components/Search/SearchBar'
import GetSearchAnime, { GetSearchAnimeOutput } from '../routes/GetSearchAnime'
import Results from '../components/Results/Results'

const SearchPage: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [results, setResults] = useState<GetSearchAnimeOutput['Data']>()

    const location = useLocation()

    const handleSearch = async (searchTerm: string): Promise<void> => {
        setLoading(true)
        setError('')

        try {
            const res = await GetSearchAnime(searchTerm)

            if (res instanceof Error) {
                setError('error getting search data')
                throw new Error('error getting search data')
            }

            if (!res.Data || res.Pagination.Count === 0) {
                setError('no search results returned')
                throw new Error('error getting search data')
            }
            setResults(res.Data)
        } catch (err) {
            setError(`fetching results ${JSON.stringify(err)}`)
        } finally {
            setLoading(false)
        }
    }

    const getQueryParameter = (param: string) => {
        const params = new URLSearchParams(location.search)
        return params.get(param)
    }

    const searchTerm = getQueryParameter('q') ?? ''

    useEffect(() => {
        if (searchTerm) {
            handleSearch(searchTerm)
        }
    }, [location.search])

    return (
        <>
            <Helmet>
                <title>{searchTerm ? `Search results for "${searchTerm}"` : 'Search'} | Dub vs Sub</title>
                <meta
                    name="description"
                    content={
                        searchTerm
                            ? `Explore dub vs sub comparisons for anime titles matching "${searchTerm}". Find out which version fans prefer.`
                            : 'Search for your favourite anime and see how the dub and sub versions compare.'
                    }
                />
            </Helmet>

            <Search setIsTop={true} />
            <Results
                searchResults={results}
                hasSearched={!!results}
                loading={loading}
                error={error}
            />
        </>
    )
}

export default SearchPage
