import React, { act } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import DubVsSubVote from './Vote'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { AnimeVoteData } from '../../routes/GetAnimeVoteData'
import * as GetAnimeVoteData from '../../routes/GetAnimeVoteData'
import * as AddVote from '../../routes/AddVote'

vi.mock('../../routes/GetAnimeVoteData', () => ({
    default: vi.fn(),
    __esModule: true,
}))

vi.mock('../../routes/AddVote', () => ({
    default: vi.fn(),
    __esModule: true,
}))

const mockVoteData: AnimeVoteData = {
    id: 1,
    Name: 'Test Anime',
    SubVote: 1,
    DubVote: 1,
    MalID: 1,
    CreatedAt: '2023-01-01',
    UpdatedAt: '2023-01-01',
}

const setup = async (malId: number) => {
    const utils = render(<DubVsSubVote malId={malId} />)

    await screen.findByTestId('titleBar')

    return {
        titleBar: screen.getByTestId('titleBar'),
        voteTitle: screen.getByTestId('voteTitle'),
        voteResults: screen.getByTestId('voteResults'),
        barChart: screen.getByTestId('barChart'),
        subPercentageBar: screen.getByTestId('subPercentageBar'),
        dubPercentageBar: screen.getByTestId('dubPercentageBar'),
        voteContainer: screen.getByTestId('voteContainer'),
        voteOptionsContainer: screen.getByTestId('voteOptionsContainer'),
        dubButton: screen.getByTestId('dubButton'),
        subButton: screen.getByTestId('subButton'),
        voteButton: screen.getByTestId('voteButton'),
        ...utils,
    }
}

describe('DubVsSubVote', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Title bar', () => {
        test('title bar loads', async () => {
            vi.mocked(GetAnimeVoteData.default).mockResolvedValue(mockVoteData)

            const { titleBar, voteTitle } = await setup(1)

            expect(titleBar).toBeVisible()
            expect(titleBar).toHaveClass('titleBar')

            expect(voteTitle).toBeVisible()
            expect(voteTitle).toContainHTML('Vote')
            expect(voteTitle).toHaveClass('voteTitle')
        })
    })

    describe('vote results', () => {
        test('vote results loads with correct percentages', async () => {
            vi.mocked(GetAnimeVoteData.default).mockResolvedValue(mockVoteData)

            const {
                voteResults,
                barChart,
                subPercentageBar,
                dubPercentageBar,
            } = await setup(1)
            expect(voteResults).toBeVisible()
            expect(voteResults).toHaveClass('vote-results')

            expect(barChart).toBeVisible()
            expect(barChart).toHaveClass('bar-chart')

            expect(subPercentageBar).toBeVisible()
            expect(subPercentageBar).toHaveClass('bar')
            expect(subPercentageBar).toHaveClass('sub-bar')
            expect(subPercentageBar).toHaveTextContent('SUB')

            expect(dubPercentageBar).toBeVisible()
            expect(dubPercentageBar).toHaveClass('bar')
            expect(dubPercentageBar).toHaveClass('dub-bar')
            expect(dubPercentageBar).toHaveTextContent('DUB')

            await waitFor(() => {
                expect(subPercentageBar).toHaveStyle('width: 50%')
                expect(dubPercentageBar).toHaveStyle('width: 50%')
            })
        })

        test('vote results loads 50/50 with no votes', async () => {
            vi.mocked(GetAnimeVoteData.default).mockResolvedValue(mockVoteData)

            const { subPercentageBar, dubPercentageBar } = await setup(1)

            await waitFor(() => {
                expect(subPercentageBar).toHaveStyle('width: 50%')
                expect(dubPercentageBar).toHaveStyle('width: 50%')
            })
        })

        test('vote results loads 50/50 with bad data', async () => {
            const mockVoteData = {}

            vi.mocked(GetAnimeVoteData.default).mockResolvedValue(
                mockVoteData as AnimeVoteData,
            )

            const { subPercentageBar, dubPercentageBar } = await setup(1)

            await waitFor(() => {
                expect(subPercentageBar).toHaveStyle('width: 50%')
                expect(dubPercentageBar).toHaveStyle('width: 50%')
            })
        })

        test('vote results loads 25/75 when split', async () => {
            const testVoteData = {
                ...mockVoteData,
                DubVote: 3,
                SubVote: 1,
            }
            vi.mocked(GetAnimeVoteData.default).mockResolvedValue(testVoteData)

            const { subPercentageBar, dubPercentageBar } = await setup(1)

            await waitFor(() => {
                expect(subPercentageBar).toHaveStyle('width: 25%')
                expect(dubPercentageBar).toHaveStyle('width: 75%')
            })
        })
    })
})

describe('voting section', () => {
    test('voting section loads', async () => {
        vi.mocked(GetAnimeVoteData.default).mockResolvedValue(mockVoteData)

        const {
            voteContainer,
            voteOptionsContainer,
            dubButton,
            subButton,
            voteButton,
        } = await setup(1)

        expect(voteContainer).toBeVisible()
        expect(voteContainer).toHaveClass('make-vote')

        expect(voteOptionsContainer).toBeVisible()
        expect(voteOptionsContainer).toHaveClass('vote-options')

        expect(dubButton).toBeVisible()
        expect(dubButton).toHaveClass('dub')
        expect(dubButton).not.toHaveClass('selected')
        expect(dubButton).toHaveTextContent('DUB')

        expect(subButton).toBeVisible()
        expect(subButton).toHaveClass('sub')
        expect(subButton).not.toHaveClass('selected')
        expect(subButton).toHaveTextContent('SUB')

        expect(voteButton).toBeVisible()
        expect(voteButton).toHaveClass('vote-button')
        expect(voteButton).toHaveTextContent('Submit Vote')
    })

    test('click dub button', async () => {
        const { dubButton } = await setup(1)

        expect(dubButton).toBeVisible()
        expect(dubButton).toHaveClass('dub')
        expect(dubButton).not.toHaveClass('selected')
        expect(dubButton).toHaveTextContent('DUB')

        await act(async () => {
            dubButton.click()
        })

        expect(dubButton).toBeVisible()
        expect(dubButton).toHaveClass('dub')
        expect(dubButton).toHaveClass('selected')
        expect(dubButton).toHaveTextContent('DUB')
    })

    test('click sub button', async () => {
        const { subButton } = await setup(1)

        expect(subButton).toBeVisible()
        expect(subButton).toHaveClass('sub')
        expect(subButton).not.toHaveClass('selected')
        expect(subButton).toHaveTextContent('SUB')

        await act(async () => {
            subButton.click()
        })

        expect(subButton).toBeVisible()
        expect(subButton).toHaveClass('sub')
        expect(subButton).toHaveClass('selected')
        expect(subButton).toHaveTextContent('SUB')
    })

    test('no vote selected', async () => {
        const { voteButton } = await setup(1)

        await act(async () => {
            voteButton.click()
        })

        const errorMessage = await screen.findByTestId('errorMessage')
        expect(errorMessage).toHaveTextContent('Please select a vote type')
    })

    test('error submitting vote', async () => {
        vi.mocked(AddVote.default).mockRejectedValue(new Error('API error'))

        const { subButton, voteButton } = await setup(1)

        await act(async () => {
            subButton.click()
        })

        await act(async () => {
            voteButton.click()
        })

        const errorMessage = await screen.findByTestId('errorMessage')
        expect(errorMessage).toHaveTextContent('Error submitting vote')
    })

    test('sub vote', async () => {
        const testVoteData = {
            ...mockVoteData,
            DubVote: 3,
            SubVote: 1,
        }
        vi.mocked(GetAnimeVoteData.default).mockResolvedValue(testVoteData)
        vi.mocked(AddVote.default).mockResolvedValue(testVoteData)

        const {
            subButton,
            dubButton,
            voteButton,
            subPercentageBar,
            dubPercentageBar,
        } = await setup(1)

        expect(voteButton).toBeVisible()
        expect(subButton).toBeVisible()
        expect(dubButton).toBeVisible()

        await act(async () => {
            subButton.click()
        })

        await act(async () => {
            voteButton.click()
        })

        expect(voteButton).not.toBeVisible()
        expect(subButton).not.toBeVisible()
        expect(dubButton).not.toBeVisible()

        await waitFor(() => {
            expect(subPercentageBar).toHaveStyle('width: 40%')
            expect(dubPercentageBar).toHaveStyle('width: 60%')
        })
    })

    test('dub vote', async () => {
        const testVoteData = {
            ...mockVoteData,
            DubVote: 3,
            SubVote: 1,
        }
        vi.mocked(GetAnimeVoteData.default).mockResolvedValue(testVoteData)
        vi.mocked(AddVote.default).mockResolvedValue(testVoteData)

        console.log(mockVoteData)

        const {
            subButton,
            dubButton,
            voteButton,
            subPercentageBar,
            dubPercentageBar,
        } = await setup(1)

        expect(voteButton).toBeVisible()
        expect(subButton).toBeVisible()
        expect(dubButton).toBeVisible()

        await act(async () => {
            dubButton.click()
        })

        await act(async () => {
            voteButton.click()
        })

        expect(voteButton).not.toBeVisible()
        expect(subButton).not.toBeVisible()
        expect(dubButton).not.toBeVisible()

        await waitFor(() => {
            expect(subPercentageBar).toHaveStyle('width: 20%')
            expect(dubPercentageBar).toHaveStyle('width: 80%')
        })
    })
})
