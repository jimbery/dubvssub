import { test } from '@playwright/test'
import { SearchResult } from '../page/search-results'
import { GetSearchData } from '../data/search/get-search-data'

const searchTerms = ['hunter x hunter', 'naruto', 'one piece']

for (const searchTerm of searchTerms) {
    test(`Search for ${searchTerm}`, async ({ page }) => {
        const searchResult = new SearchResult(page)

        const testData = GetSearchData[searchTerm]

        // GIVEN I am on the home page
        await searchResult.goto(searchTerm)

        // THEN search page loads
        await searchResult.pageLoads(searchTerm)

        // THEN number of results is as expected
        await searchResult.numberOfResultsLoaded(testData.Pagination.Count)
        await searchResult.numberOfResultsLoaded(testData.Data.length)
    })
}
