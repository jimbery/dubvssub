// Results.tsx
import React from 'react'
import { GetSearchAnimeOutput } from '../../routes/GetSearchAnime'

interface ResultsProps {
    searchResults: GetSearchAnimeOutput['Data']
    hasSearched: boolean
    error?: string
}

const Results: React.FC<ResultsProps> = ({
    searchResults,
    hasSearched,
    error,
}) => {
    return (
        <div className="results">
            {hasSearched ? (
                // Check if there's an error first
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
                                    {result.Title}
                                </div>
                                <div className="resultDesc multi-line">
                                    {result.Synopsis}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Message when no results are found
                    <div className="error">No results found.</div> // Use error styling
                )
            ) : null}
        </div>
    )
}

export default Results
