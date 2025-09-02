import { Locator, Page, expect } from '@playwright/test'
import { GetSearchData } from '../data/search/get-search-data'
import { GetSearchAnimeOutput } from '../../src/api/get-search-anime'

export class SearchResult {
    readonly page: Page

    readonly resultItems: Locator

    constructor(page: Page) {
        this.page = page

        this.resultItems = page.getByTestId('resultItem')
    }

    async goto(searchTerm: string) {
        const testData = GetSearchData[searchTerm]

        await this.page.route(`**/api/search*`, (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(testData),
            })
        })
        await this.page.goto(`/search?q=${searchTerm}`)
    }

    async pageLoads(searchTerm: string) {
        await this.page.waitForLoadState()
        expect(this.page.url()).toContain(`search?q=${encodeURI(searchTerm)}`)
    }

    async numberOfResultsLoaded(noOfResults: number) {
        await expect(this.resultItems).toHaveCount(noOfResults)
    }

    async resultContentCorrect(animeData: GetSearchAnimeOutput['Data']) {
        const searchList = this.resultItems

        for (let i = 0; i < animeData.length; i++) {
            expect(searchList[i].Image).toContain(animeData[i].Image)
            expect(searchList[i].Synopsis).toContain(animeData[i].Synopsis)
            expect(searchList[i].Title).toContain(animeData[i].Title)
        }
    }
}
