import React from 'react'
import { GetSearchAnimeOutput } from '../../api/get-search-anime'

interface ResultsProps {
    searchResults: GetSearchAnimeOutput['Data'] | undefined
    hasSearched: boolean
    loading: boolean
    error?: string
}

const Results: React.FC<ResultsProps> = ({
    searchResults,
    hasSearched,
    loading,
    error,
}) => {
    const renderLoading = () => <div>Loading...</div>

    const renderError = () => <div className="error">{error}</div>

    const renderNoResults = () => <div className="error">No results found.</div>

    const renderResultItem = (
        result: GetSearchAnimeOutput['Data'][0],
        index: number,
    ) => (
        <div className="resultItem" data-testid="resultItem" key={index}>
            <img className="resultImg" src={result.Image} alt={result.Title} />
            <div className="resultText">
                <div className="resultTitle single-line">
                    <a href={`/anime/${result.MalID}`}>{result.Title}</a>
                </div>
                <div className="resultDesc multi-line">{result.Synopsis}</div>
            </div>
        </div>
    )

    const renderResults = () => {
        if (!searchResults) return null

        return searchResults.map(renderResultItem)
    }

    const renderContent = () => {
        if (loading || !searchResults) {
            return renderLoading()
        }

        if (!hasSearched) {
            return null
        }

        if (error) {
            return renderError()
        }

        if (searchResults.length === 0) {
            return renderNoResults()
        }

        return renderResults()
    }

    return <div className="results">{renderContent()}</div>
}

export default Results
