import { Locator, Page } from '@playwright/test'

export class HomePage {
    readonly page: Page

    // images
    readonly dubVsSubIcon: Locator

    // components
    readonly searchBar: Locator
    readonly searchButton: Locator

    constructor(page: Page) {
        this.page = page

        // images
        this.dubVsSubIcon = page.getByTestId('dubVsSubBannerIcon')

        // components
        this.searchBar = page.getByTestId('search')
        this.searchButton = page.getByTestId('searchButton')
    }

    async goto() {
        this.page.goto('')
    }
}
