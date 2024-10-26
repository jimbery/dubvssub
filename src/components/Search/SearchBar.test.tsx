import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { Search } from './SearchBar'
import GetSearchAnime, {
    GetSearchAnimeOutput,
} from '../../routes/GetSearchAnime'
import '@testing-library/jest-dom/extend-expect'

// Mocking the GetSearchAnime function
jest.mock('../../routes/GetSearchAnime')

describe('Search component', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('renders search component with input, button, and logo', () => {
        render(<Search />)
        const inputElement = screen.getByPlaceholderText('Enter Post Title...')
        const buttonElement = screen.getByRole('button', { name: /search/i }) // Use role to target the button
        const logoElement = screen.getByAltText('Logo')

        expect(inputElement).toBeInTheDocument()
        expect(buttonElement).toBeInTheDocument()
        expect(logoElement).toBeInTheDocument()
    })

    test('calls GetSearchAnime and displays results when search is successful', async () => {
        const mockSearchData: GetSearchAnimeOutput = {
            Data: [
                {
                    Title: 'Anime 1',
                    Synopsis: 'Synopsis 1',
                    MalID: 1,
                    Image: 'http://image.com/1',
                },
                {
                    Title: 'Anime 2',
                    Synopsis: 'Synopsis 2',
                    MalID: 2,
                    Image: 'http://image.com/2',
                },
            ],
            Pagination: { Count: 2, Total: 2 },
        }

        const mockedGetSearchAnime = GetSearchAnime as jest.Mock
        mockedGetSearchAnime.mockResolvedValueOnce(mockSearchData)

        render(<Search />)
        const inputElement = screen.getByPlaceholderText('Enter Post Title...')
        const buttonElement = screen.getByRole('button', { name: /search/i }) // Use role to target the button

        fireEvent.change(inputElement, { target: { value: 'Naruto' } })
        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockedGetSearchAnime).toHaveBeenCalledWith('Naruto')
            expect(screen.getByText('Anime 1')).toBeInTheDocument()
            expect(screen.getByText('Anime 2')).toBeInTheDocument()
        })
    })

    test('displays error message when search returns no data', async () => {
        const mockedGetSearchAnime = GetSearchAnime as jest.Mock
        mockedGetSearchAnime.mockResolvedValueOnce({ Data: null })

        render(<Search />)
        const inputElement = screen.getByPlaceholderText('Enter Post Title...')
        const buttonElement = screen.getByRole('button', { name: /search/i }) // Use role to target the button

        fireEvent.change(inputElement, { target: { value: 'InvalidAnime' } })
        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockedGetSearchAnime).toHaveBeenCalledWith('InvalidAnime')
            expect(screen.getByText('No data found')).toBeInTheDocument()
        })
    })

    test('displays unexpected error message when search fails', async () => {
        const mockedGetSearchAnime = GetSearchAnime as jest.Mock
        mockedGetSearchAnime.mockRejectedValueOnce(new Error('Network Error'))

        render(<Search />)
        const inputElement = screen.getByPlaceholderText('Enter Post Title...')
        const buttonElement = screen.getByRole('button', { name: /search/i }) // Use role to target the button

        fireEvent.change(inputElement, { target: { value: 'AnyAnime' } })
        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockedGetSearchAnime).toHaveBeenCalledWith('AnyAnime')
            expect(
                screen.getByText('An unexpected error occurred.'),
            ).toBeInTheDocument()
        })
    })
})
