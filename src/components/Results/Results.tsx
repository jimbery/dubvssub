// Results.tsx
import React from 'react'
import { GetSearchAnimeOutput } from '../../routes/GetSearchAnime'

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
    return (
        <div className="results">
            {loading || !searchResults ? (
                <div>Loading...</div> // Show loading message while fetching
            ) : hasSearched ? (
                error ? (
                    <div className="error">{error}</div> // Show error message with proper styling
                ) : searchResults.length > 0 ? (
                    // Show results if there are any
                    searchResults.map((result, index) => (
                        <div className="resultItem" key={index}>
                            <img
                                className="resultImg"
                                src={result.Image}
                                alt={result.Title}
                            />
                            <div className="resultText">
                                <div className="resultTitle single-line">
                                    <a href={`/anime/${result.MalID}`}>
                                        {result.Title}
                                    </a>
                                </div>
                                <div className="resultDesc multi-line">
                                    {result.Synopsis}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <div>Loading</div>
                        <div className="error">No results found.</div>
                    </>
                )
            ) : null}
        </div>
    )
}

export default Results
