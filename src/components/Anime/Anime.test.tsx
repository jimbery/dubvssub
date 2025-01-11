import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Anime from './Anime'
import GetAnime from '../../routes/GetAnime'

// Mock GetAnime function
jest.mock('../../routes/GetAnime', () => jest.fn())

const mockGetAnime = GetAnime as jest.Mock

describe('Anime Component', () => {
    const mockAnimeData = {
        Title: 'Mock Anime Title',
        Year: 2021,
        Rating: 'PG-13',
        Episodes: 24,
        Image: 'https://example.com/image.jpg',
        Genres: [{ Name: 'Action' }, { Name: 'Adventure' }],
        Synopsis: 'This is a mock synopsis.',
        Streaming: [
            { Name: 'Crunchyroll', URL: 'https://crunchyroll.com' },
            { Name: 'Netflix', URL: 'https://netflix.com' },
        ],
        Trailer: 'https://youtube.com/trailer',
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('renders loading state initially', () => {
        render(
            <Router>
                <Anime />
            </Router>,
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('renders no streaming logos if none are available', async () => {
        const mockAnimeDataNoStreaming = { ...mockAnimeData, Streaming: [] }
        mockGetAnime.mockResolvedValue(mockAnimeDataNoStreaming)

        render(
            <Router>
                <Anime />
            </Router>,
        )

        expect(screen.queryByAltText('Crunchyroll')).not.toBeInTheDocument()
        expect(screen.queryByAltText('Netflix')).not.toBeInTheDocument()
    })
})
