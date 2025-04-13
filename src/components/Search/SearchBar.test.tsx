import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Search } from './SearchBar'
import { describe, test, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
const setup = (setIsTop: boolean) => {
    const utils = render(<Search setIsTop={setIsTop} />)

    const dubVsSubBannerIcon = screen.getByTestId('dubVsSubBannerIcon')
    const searchBar = screen.getByTestId('searchBar')
    const searchField = screen.getByTestId('searchField')
    const searchButton = screen.getByTestId('searchButton')

    return {
        dubVsSubBannerIcon,
        searchBar,
        searchField,
        searchButton,
        ...utils,
    }
}

/**
 * @vitest-environment jsdom
 */
describe('Search Component', () => {
    test('renders setIsTop set to true', () => {
        const { dubVsSubBannerIcon } = setup(true)

        expect(dubVsSubBannerIcon).toBeInTheDocument()
        expect(dubVsSubBannerIcon).toHaveClass('icon')
        expect(dubVsSubBannerIcon).toHaveAttribute(
            'src',
            expect.stringContaining('icon'),
        )
    })

    test('renders setIsTop set to false', () => {
        const { dubVsSubBannerIcon } = setup(false)

        expect(dubVsSubBannerIcon).toBeInTheDocument()
        expect(dubVsSubBannerIcon).toHaveClass('banner')
        expect(dubVsSubBannerIcon).toHaveAttribute(
            'src',
            expect.stringMatching('banner'),
        )
    })

    test('search bar loads', () => {
        const { searchBar, searchField, searchButton } = setup(false)

        expect(searchBar).toHaveAttribute(
            'role',
            expect.stringMatching('search'),
        )
        expect(searchBar).toHaveClass('search-bar')

        expect(searchField).toHaveAttribute(
            'placeholder',
            expect.stringMatching('Search for anime...'),
        )
        expect(searchField).toHaveAttribute(
            'type',
            expect.stringMatching('search'),
        )
        expect(searchField).toHaveAttribute(
            'id',
            expect.stringMatching('search'),
        )

        expect(searchButton).toHaveAttribute(
            'type',
            expect.stringMatching('submit'),
        )
        expect(searchButton).toHaveClass('search-button')
    })

    test('placeholder changes on text entry', () => {
        const { searchField } = setup(false)

        fireEvent.change(searchField, { target: { value: '123' } })

        expect(searchField).toHaveValue('123')
    })

    test('search fires request and redirects to correct URL', () => {
        // mock window.location.href
        Object.defineProperty(window, 'location', {
            value: {
                href: '',
            },
            writable: true,
        })

        const { searchField, searchButton } = setup(false)

        fireEvent.change(searchField, { target: { value: 'Naruto' } })
        fireEvent.click(searchButton)

        expect(window.location.href).toBe('/search?q=Naruto')
    })
})
