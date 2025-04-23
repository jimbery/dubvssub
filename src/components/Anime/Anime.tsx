import React, { useState, useEffect } from 'react'
import './Anime.css'
import '../Results/Results.css'
import GetAnime, { GetAnimeOutput } from '../../routes/GetAnime'
import Crunchyroll from '../../assets/crunchyroll.png'
import Netflix from '../../assets/netflix.png'
import DubVsSubVote from '../Vote/Vote'
import { Helmet } from 'react-helmet'

interface AnimeProps {
    id: string
}

export const Anime: React.FC<AnimeProps> = ({ id }) => {
    const [animeData, setAnimeData] = useState<GetAnimeOutput | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (id) {
            getAnime(id)
        }
    }, [id])

    const getAnime = async (animeId: string) => {
        try {
            const data = await GetAnime(Number(animeId))

            if (data instanceof Error || !data) {
                setError(data instanceof Error ? data.message : 'No data found')
            } else {
                setError('')
                setAnimeData(data)
            }
        } catch (err) {
            setError(`An unexpected error occurred. ${JSON.stringify(err)}`)
        }
    }

    const renderStreamingLogo = (
        stream: { Name: string; URL: string },
        index: number,
    ) => {
        if (stream.Name === 'Crunchyroll' || stream.Name === 'Netflix') {
            return (
                <a
                    key={index}
                    href={stream.URL}
                    data-testid={`streamingLogoContainer${stream.Name}`}
                >
                    <img
                        className="streamingLogo"
                        data-testid={`streamingLogo${stream.Name}`}
                        src={
                            stream.Name === 'Crunchyroll'
                                ? Crunchyroll
                                : Netflix
                        }
                        alt={stream.Name}
                    />
                </a>
            )
        }
        return null
    }

    const renderGenres = () => (
        <div className="genres">
            {animeData?.Genres.map((genre) => (
                <div className="genre-badge" key={genre.Name}>
                    {genre.Name}
                </div>
            ))}
        </div>
    )

    const renderMetadata = () => (
        <div className="metadata" data-testid="metadata">
            {animeData?.Year.toString()} • {animeData?.Rating} •{' '}
            {animeData?.Episodes.toString()} episodes
        </div>
    )

    const renderContent = () => {
        if (error) {
            return <p className="error">{error}</p>
        }

        if (!animeData) {
            return <p>Loading...</p>
        }

        return (
            <>
                <Helmet>
                    <title>{animeData.Title} | Dub vs Sub</title>
                    <meta
                        name="description"
                        content={`Compare the dub and sub versions of "${animeData.Title}". ${animeData.Synopsis.slice(0, 100)}...`}
                    />
                </Helmet>

                <div className="topBlock" data-testid="topBlock">
                    <h1 className="title" data-testid="title">
                        {animeData.Title}
                    </h1>
                    {renderMetadata()}
                </div>

                <div className="descBlock" data-testid="descBlock">
                    <img
                        className="animeImage"
                        data-testid="animeImage"
                        src={animeData.Image}
                        alt={animeData.Title}
                    />

                    <div className="middle" data-testid="middle">
                        {renderGenres()}

                        <div className="text" data-testid="text">
                            <h1 className="synopsisTitle" data-testid="synopsisTitle">
                                Synopsis
                            </h1>
                            <h2 className="synopsis" data-testid="synopsis">
                                {animeData.Synopsis}
                            </h2>

                            <h1 className="streamingTitle" data-testid="streamingTitle">
                                Where to watch...
                            </h1>
                            <div className="streamingLogos" data-testid="streamingLogos">
                                {animeData.Streaming.map(renderStreamingLogo)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="votes" data-testid="votes">
                    <DubVsSubVote malId={animeData.MalID} />
                </div>

                <div className="trailerSection" data-testid="trailerSection">
                    <iframe
                        className="player"
                        data-testid="player"
                        src={animeData.Trailer}
                        frameBorder="0"
                        title={`${animeData.Title} trailer`}
                    />
                </div>
            </>
        )
    }

    return (
        <div className="input-wrapper">
            <div className="anime-details">{renderContent()}</div>
        </div>
    )
}

export default Anime
