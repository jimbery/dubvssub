import { test, expect } from '@playwright/test'
import { HomePage } from '../page/home'
import GetLangClass from '../util/GetLangClass'

test('Home page loads', async ({ page }) => {
    // Initialize your page objects and language
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
