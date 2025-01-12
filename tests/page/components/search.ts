import { Locator, Page, expect } from '@playwright/test'

export class SearchBar {
    readonly page: Page

    // components
    readonly searchBar: Locator
    readonly searchButton: Locator
    readonly dubVsSubIcon: Locator

    constructor(page: Page) {
        this.page = page

        // components
        this.searchBar = page.getByTestId('search')
        this.searchButton = page.getByTestId('searchButton')

        // banner icon
        this.dubVsSubIcon = page.getByTestId('dubVsSubBannerIcon')
    }

    async enterTextInSearchBar(searchTerm: string) {
        await expect(this.searchBar).toBeVisible()
        await this.searchBar.fill(searchTerm)
    }

    async searchBarHasPlaceholder(placeholder: string) {
        await expect(this.searchBar).toBeVisible()
        await expect(this.searchBar).toHaveAttribute('placeholder', placeholder)
    }

    async logoStateIs(input: 'banner' | 'icon') {
        await expect(this.dubVsSubIcon).toBeVisible()
        await expect(this.dubVsSubIcon).toHaveClass(input)
    }
}
