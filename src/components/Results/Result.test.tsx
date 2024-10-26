import React from 'react'
import { render, screen } from '@testing-library/react'
import Results from './Results'
import { GetSearchAnimeOutput } from '../../routes/GetSearchAnime'

describe('Results component', () => {
    const mockSearchResults: GetSearchAnimeOutput['Data'] = [
        {
            Title: 'Anime 1',
            Synopsis: 'Synopsis 1',
            MalID: 1,
            Image: 'http://image1.com',
        },
        {
            Title: 'Anime 2',
            Synopsis: 'Synopsis 2',
            MalID: 2,
            Image: 'http://image2.com',
        },
    ]

    test('renders nothing if hasSearched is false', () => {
        render(<Results searchResults={[]} hasSearched={false} error={''} />)
        expect(screen.queryByText('No results found.')).not.toBeInTheDocument()
    })

    test('displays search results correctly when data is available', () => {
        render(
            <Results
                searchResults={mockSearchResults}
                hasSearched={true}
                error={''}
            />,
        )

        // Check that results are displayed
        expect(screen.getByText('Anime 1')).toBeInTheDocument()
        expect(screen.getByText('Synopsis 1')).toBeInTheDocument()
        expect(screen.getByText('Anime 2')).toBeInTheDocument()
        expect(screen.getByText('Synopsis 2')).toBeInTheDocument()

        // Check that images are displayed
        const images = screen.getAllByRole('img')
        expect(images).toHaveLength(2)
        expect(images[0]).toHaveAttribute('src', 'http://image1.com')
        expect(images[1]).toHaveAttribute('src', 'http://image2.com')
    })

    test('displays error message when error is provided', () => {
        const errorMessage = 'An unexpected error occurred.'
        render(
            <Results
                searchResults={[]}
                hasSearched={true}
                error={errorMessage}
            />,
        )

        expect(screen.getByText(errorMessage)).toBeInTheDocument()
        expect(screen.queryByText('No results found.')).not.toBeInTheDocument() // Ensure "No results found" isn't shown
    })

    test('displays "No results found" message when there are no results and no error', () => {
        render(<Results searchResults={[]} hasSearched={true} error={''} />)

        expect(screen.getByText('No results found.')).toBeInTheDocument()
    })
})
