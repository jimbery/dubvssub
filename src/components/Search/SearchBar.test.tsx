import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { Search } from './SearchBar'
import GetSearchAnime, {
    GetSearchAnimeOutput,
} from '../../routes/GetSearchAnime'

// Mocking the GetSearchAnime function
jest.mock('../../routes/GetSearchAnime')

describe('Search component', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('renders search component', () => {
        render(<Search />)
        const inputElement = screen.getByPlaceholderText('Enter Post Title...')
        const buttonElement = screen.getByText('Search')
        expect(inputElement).toBeInTheDocument()
        expect(buttonElement).toBeInTheDocument()
    })

    test('searches for anime when form is submitted', async () => {
        // Mock the GetSearchAnime API function
        const mockSearchData: GetSearchAnimeOutput = {
            Data: [
                {
                    Title: 'Anime 1',
                    Synopsis: 'test',
                    MalID: 1,
                    Image: 'http://image.com',
                },
                {
                    Title: 'Anime 2',
                    Synopsis: 'test',
                    MalID: 2,
                    Image: 'http://image.com',
                },
            ],
            Pagination: { Count: 2, Total: 2 },
        }

        // const mockGetSearchAnime = GetSearchAnime as jest.MockedFunction<typeof GetSearchAnime>
        const mockedGetSearch = GetSearchAnime as jest.Mock
        mockedGetSearch.mockImplementation(() => mockSearchData)

        render(<Search />)
        const inputElement = screen.getByPlaceholderText('Enter Post Title...')
        const buttonElement = screen.getByText('Search')

        fireEvent.change(inputElement, { target: { value: 'Naruto' } })
        fireEvent.submit(buttonElement)

        await waitFor(() => {
            // Assert that Anime 1 and Anime 2 elements exist in the document
            expect(mockedGetSearch).toHaveBeenCalledWith('Naruto')
            expect(screen.getByText(/Anime 1/)).toBeInTheDocument()
            expect(screen.getByText(/Anime 2/)).toBeInTheDocument()
        })
    })

    test('displays error message when search fails', async () => {
        // Mocking the GetSearchAnime function to return an error
        const mockGetSearchAnime = GetSearchAnime as jest.MockedFunction<
            typeof GetSearchAnime
        >
        // mockGetSearchAnime.mockRejectedValueOnce(new Error('💣'))

        render(<Search />)
        const inputElement = screen.getByPlaceholderText('Enter Post Title...')
        const buttonElement = screen.getByText('Search')

        fireEvent.change(inputElement, { target: { value: 'InvalidAnime' } })
        fireEvent.click(buttonElement)

        await waitFor(() => {
            expect(mockGetSearchAnime).toHaveBeenCalledWith('InvalidAnime')
            expect(screen.getByText('No results found')).toBeInTheDocument()
        })
    })
})
