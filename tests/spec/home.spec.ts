import { test, expect } from '@playwright/test'
import { HomePage } from '../page/home'
import GetLangClass from '../util/get-lang-class'
import { SearchBar } from '../page/components/search-bar'
import { SearchResult } from '../page/search-results'

test('Home page loads', async ({ page }) => {
    const home = new HomePage(page)
    const searchBar = new SearchBar(page)
    const lang = GetLangClass('enGB')

    // WHEN I go to the landing screen
    await home.goto()

    // THEN the page title is DubVsSub
    await expect(page).toHaveTitle(lang.homePageTitle)

    // THEN the search bar has a placeholder of "Enter anime title..."
    await searchBar.searchBarHasPlaceholder(lang.searchBarPlaceholder)

    // THEN the dubVsSub banner is visible
    await searchBar.logoStateIs('banner')

    // THEN the search text button is not visible
    await expect(searchBar.searchButton).not.toBeVisible()
})

test('Type in search bar', async ({ page }) => {
    const home = new HomePage(page)
    const searchBar = new SearchBar(page)
    const lang = GetLangClass('enGB')

    const searchTerm = 'hunter x'

    // GIVEN I am on the home page
    await home.goto()

    // WHEN I enter text in the search bar
    await searchBar.enterTextInSearchBar(searchTerm)

    // THEN the text appears in the bar
    await expect(searchBar.searchBar).toHaveValue(searchTerm)

    // Then the search button is visible
    await expect(searchBar.searchButton).toBeVisible()
    await expect(searchBar.searchButton).toHaveText(lang.searchButton)
})

test('Type in search bar, clear search', async ({ page }) => {
    const home = new HomePage(page)
    const searchBar = new SearchBar(page)
    const lang = GetLangClass('enGB')

    const searchTerm = 'hunter x'

    // GIVEN I am on the home page
    await home.goto()

    // GIVEN I enter text in the search bar
    await searchBar.enterTextInSearchBar(searchTerm)

    // WHEN I clear the search term
    await searchBar.enterTextInSearchBar('')

    // THEN the search text button is not visible
    await expect(searchBar.searchButton).not.toBeVisible()

    // THEN the no text appears in the bar
    await expect(searchBar.searchBar).toHaveValue('')

    // THEN the search bar has a placeholder of "Enter anime title..."
    await expect(searchBar.searchBar).toHaveAttribute(
        'placeholder',
        lang.searchBarPlaceholder,
    )
})

test('Search for hunter x hunter', async ({ page }) => {
    const home = new HomePage(page)
    const searchBar = new SearchBar(page)
    const searchResult = new SearchResult(page)

    const searchTerm = 'hunter x hunter'

    // GIVEN I am on the home page
    await home.goto()

    // GIVEN I enter text in the search bar
    await searchBar.enterTextInSearchBar(searchTerm)

    // WHEN I click the search button
    await searchBar.clickSearchButton()

    // THEN search page loads
    await searchResult.pageLoads(searchTerm)
})
