import { test, expect } from '@playwright/test'
import { HomePage } from '../page/home'
import GetLangClass from '../util/GetLangClass'

test('Home page loads', async ({ page }) => {
    const home = new HomePage(page)
    const lang = GetLangClass('enGB')

    // WHEN I go to the landing screen
    await home.goto()

    // THEN the page title is DubVsSub
    await expect(page).toHaveTitle(lang.homePageTitle)

    // THEN the search bar has a placeholder of "Enter anime title..."
    await expect(home.searchBar).toBeVisible()
    await expect(home.searchBar).toHaveAttribute(
        'placeholder',
        lang.searchBarPlaceholder,
    )

    // THEN the dubVsSub banner is visible
    await expect(home.dubVsSubIcon).toBeVisible()
    await expect(home.dubVsSubIcon).toHaveClass('banner')

    // THEN the search text button is not visible
    await expect(home.searchButton).not.toBeVisible()
})

test('Type in search bar', async ({ page }) => {
    const home = new HomePage(page)
    const lang = GetLangClass('enGB')

    const searchTerm = 'hunter x'

    // GIVEN I am on the home page
    await home.goto()

    // WHEN I enter text in the search bar
    await home.enterTextInSearchBar(searchTerm)

    // THEN the text appears in the bar
    await expect(home.searchBar).toHaveValue(searchTerm)

    // Then the search button is visible
    await expect(home.searchButton).toBeVisible()
    await expect(home.searchButton).toHaveText(lang.searchButton)
})

test('Type in search bar, clear search', async ({ page }) => {
    const home = new HomePage(page)
    const lang = GetLangClass('enGB')

    const searchTerm = 'hunter x'

    // GIVEN I am on the home page
    await home.goto()

    // GIVEN I enter text in the search bar
    await home.enterTextInSearchBar(searchTerm)

    // WHEN I clear the search term
    await home.enterTextInSearchBar('')

    // THEN the search text button is not visible
    await expect(home.searchButton).not.toBeVisible()

    // THEN the no text appears in the bar
    await expect(home.searchBar).toHaveValue('')

    // THEN the search bar has a placeholder of "Enter anime title..."
    await expect(home.searchBar).toHaveAttribute(
        'placeholder',
        lang.searchBarPlaceholder,
    )
})
