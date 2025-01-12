import { Locator, Page } from '@playwright/test'

export class HomePage {
    readonly page: Page

    // images
    readonly dubVsSubIcon: Locator

    constructor(page: Page) {
        this.page = page
    }

    async goto() {
        this.page.goto('')
    }
}
