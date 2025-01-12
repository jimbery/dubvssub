import React from 'react' // Use act from react
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { Search } from './SearchBar'

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}))

const mockUseParams = useParams as jest.Mock

describe('Search Component', () => {
    beforeEach(() => {
        // Mock the return value of useParams
        mockUseParams.mockReturnValue({ id: null })
    })
    test('renders correctly with setIsTop as true', () => {
        render(
            <Router>
                <Search setIsTop={true} />
            </Router>,
        )

        // Logo changes based on setIsTop
        const logo = screen.getByAltText('Logo')
        expect(logo).toHaveClass('icon')

        // Search bar elements
        expect(screen.getByRole('search')).toBeInTheDocument()
        expect(screen.getByLabelText(/search/i)).toBeInTheDocument()
        expect(screen.getByTestId('search')).toBeInTheDocument()
        expect(
            screen.getByRole('button', { name: /search/i }),
        ).toBeInTheDocument()
    })

    test('renders correctly with setIsTop as false', () => {
        render(
            <Router>
                <Search setIsTop={false} />
            </Router>,
        )

        // Logo changes based on setIsTop
        const logo = screen.getByAltText('Logo')
        expect(logo).toHaveClass('banner')
    })

    test('updates search input value correctly', () => {
        render(
            <Router>
                <Search setIsTop={false} />
            </Router>,
        )

        const input = screen.getByTestId('search')

        fireEvent.change(input, { target: { value: 'Test Search' } })
        expect(input).toHaveValue('Test Search')
    })

    test('redirects on form submission', () => {
        // Mock window.location.href
        const originalLocation = window.location
        Object.defineProperty(window, 'location', {
            value: { ...originalLocation, href: '' },
            writable: true,
        })

        window.location = { ...originalLocation, href: '' }

        render(
            <Router>
                <Search setIsTop={false} />
            </Router>,
        )

        const input = screen.getByTestId('search')
        const form = screen.getByRole('search')

        fireEvent.change(input, { target: { value: 'Test Query' } })
        fireEvent.submit(form)

        expect(window.location.href).toBe('/search?q=Test%20Query')

        // Restore original location object
        window.location = originalLocation
    })

    test('handles empty params gracefully', () => {
        mockUseParams.mockReturnValue({ id: null })

        render(
            <Router>
                <Search setIsTop={true} />
            </Router>,
        )

        // Verify no crashes when `id` is null
        expect(screen.getByRole('search')).toBeInTheDocument()
    })

    test('handles non-empty params', () => {
        mockUseParams.mockReturnValue({ id: '123' })

        render(
            <Router>
                <Search setIsTop={true} />
            </Router>,
        )

        // Verify no crashes when `id` is provided
        expect(screen.getByRole('search')).toBeInTheDocument()
    })
})
