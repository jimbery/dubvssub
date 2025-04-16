import React from 'react'
import { act, render, screen } from '@testing-library/react'
import Anime from './Anime'
import { describe, test, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { GetAnimeOutput } from '../../routes/GetAnime'
import * as GetAnime from '../../routes/GetAnime'

vi.mock('../../routes/GetAnime', () => ({
    default: vi.fn(),
    __esModule: true,
}))

const setup = async (id: string) => {
    let utils: ReturnType<typeof render>

    await act(async () => {
        utils = render(<Anime id={id} />)
    })

    await screen.findByTestId('topBlock')

    return {
        topBlock: screen.getByTestId('topBlock'),
        title: screen.getByTestId('title'),
        metadata: screen.getByTestId('metadata'),
        descBlock: screen.getByTestId('descBlock'),
        animeImage: screen.getByTestId('animeImage'),
        middle: screen.getByTestId('middle'),
        text: screen.getByTestId('text'),
        synopsisTitle: screen.getByTestId('synopsisTitle'),
        synopsis: screen.getByTestId('synopsis'),
        streamingTitle: screen.getByTestId('streamingTitle'),
        streamingLogos: screen.getByTestId('streamingLogos'),
        votes: screen.getByTestId('votes'),
        trailerSection: screen.getByTestId('trailerSection'),
        player: screen.getByTestId('player'),
        ...utils!,
    }
}

/**
 * @vitest-environment jsdom
 */
describe('Results Component', () => {
    const mockAnimeData: GetAnimeOutput = {
        Image: 'https://example.com/image1.jpg',
        Title: 'Anime Title 1',
        Synopsis: 'Synopsis of Anime 1',
        MalID: 1,
        Year: 2022,
        Episodes: 12,
        Rating: '8.5',
        Trailer: 'https://example.com/trailer1.mp4',
        Genres: [
            { Name: 'Action' },
            { Name: 'Adventure' },
            { Name: 'Fantasy' },
        ],
        Streaming: [
            {
                Name: 'Crunchyroll',
                URL: 'https://crunchyroll.com/anime1',
            },
        ],
    }

    test('renders loading state', async () => {
        await act(async () => {
            render(<Anime id="" />)
        })

        expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    test('page loads correctly', async () => {
        vi.mocked(GetAnime.default).mockResolvedValue(mockAnimeData)

        const {
            player,
            trailerSection,
            votes,
            streamingLogos,
            streamingTitle,
            topBlock,
            title,
            metadata,
            descBlock,
            animeImage,
            middle,
            text,
            synopsisTitle,
            synopsis,
        } = await setup('1')

        expect(topBlock).toBeVisible()
        expect(topBlock).toHaveClass('topBlock')

        expect(title).toBeVisible()
        expect(title).toHaveClass('title')
        expect(title).toHaveTextContent(mockAnimeData.Title)

        expect(metadata).toBeVisible()
        expect(metadata).toHaveClass('metadata')
        expect(metadata).toHaveTextContent(
            `${mockAnimeData?.Year.toString()} • ${mockAnimeData?.Rating} • ${mockAnimeData?.Episodes.toString()} episodes`,
        )

        expect(descBlock).toBeVisible()
        expect(descBlock).toHaveClass('descBlock')

        expect(animeImage).toBeVisible()
        expect(animeImage).toHaveAttribute('src', mockAnimeData.Image)
        expect(animeImage).toHaveAttribute('alt', mockAnimeData.Title)

        expect(middle).toBeVisible()
        expect(middle).toHaveClass('middle')

        expect(text).toBeVisible()
        expect(text).toHaveClass('text')

        expect(synopsisTitle).toBeVisible()
        expect(synopsisTitle).toHaveClass('synopsisTitle')
        expect(synopsisTitle).toHaveTextContent('Synopsis')

        expect(synopsis).toBeVisible()
        expect(synopsis).toHaveClass('synopsis')
        expect(synopsis).toHaveTextContent(mockAnimeData.Synopsis)

        expect(streamingTitle).toBeVisible()
        expect(streamingTitle).toHaveClass('streamingTitle')
        expect(streamingTitle).toHaveTextContent('Where to watch...')

        expect(streamingLogos).toBeVisible()
        expect(streamingLogos).toHaveClass('streamingLogos')

        mockAnimeData.Streaming.forEach(async (provider) => {
            expect(
                await screen.findByTestId(
                    `streamingLogoContainer${provider.Name}`,
                ),
            ).toHaveAttribute('href', provider.URL)
            expect(
                await screen.findByTestId(`streamingLogo${provider.Name}`),
            ).toHaveAttribute(
                'src',
                `/src/assets/${provider.Name.toLocaleLowerCase()}.png`,
            )
        })

        expect(votes).toBeVisible()
        expect(votes).toHaveClass('votes')

        expect(trailerSection).toBeVisible()
        expect(trailerSection).toHaveClass('trailerSection')

        expect(player).toBeVisible()
        expect(player).toHaveClass('player')
        expect(player).toHaveAttribute('src', mockAnimeData.Trailer)
    })
})
