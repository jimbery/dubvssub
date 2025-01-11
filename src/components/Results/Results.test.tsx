import React from 'react'
import { render, screen } from '@testing-library/react'
import Results from './Results'

describe('Results Component', () => {
    const mockSearchResults = [
        {
            Image: 'https://example.com/image1.jpg',
            Title: 'Anime Title 1',
            Synopsis: 'Synopsis of Anime 1',
            MalID: 1,
        },
        {
            Image: 'https://example.com/image2.jpg',
            Title: 'Anime Title 2',
            Synopsis: 'Synopsis of Anime 2',
            MalID: 2,
        },
    ]

    test('renders loading state', () => {
        render(
            <Results
                searchResults={undefined}
                hasSearched={false}
                loading={true}
            />,
        )
        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('renders no results found message', () => {
        render(
            <Results searchResults={[]} hasSearched={true} loading={false} />,
        )
        expect(screen.getByText('Loading')).toBeInTheDocument()
        expect(screen.getByText('No results found.')).toBeInTheDocument()
    })

    test('renders search results', () => {
        render(
            <Results
                searchResults={mockSearchResults}
                hasSearched={true}
                loading={false}
            />,
        )

        // Check if each result is rendered
        mockSearchResults.forEach((result) => {
            expect(screen.getByText(result.Title)).toBeInTheDocument()
            expect(screen.getByAltText(result.Title)).toBeInTheDocument()
            expect(screen.getByText(result.Synopsis)).toBeInTheDocument()
        })

        // Check if the links are correct
        mockSearchResults.forEach((result) => {
            const link = screen.getByText(result.Title).closest('a')
            expect(link).toHaveAttribute('href', `/anime/${result.MalID}`)
        })
    })

    test('renders nothing if hasSearched is false', () => {
        render(
            <Results
                searchResults={mockSearchResults}
                hasSearched={false}
                loading={false}
            />,
        )
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        expect(
            screen.queryByText(mockSearchResults[0].Title),
        ).not.toBeInTheDocument()
    })
})