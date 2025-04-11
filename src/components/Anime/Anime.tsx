import React, { useState, useEffect } from 'react'
import './Anime.css'
import '../Results/Results.css'
import GetAnime, { GetAnimeOutput } from '../../routes/GetAnime'
import { useParams } from 'react-router-dom'
import { Search } from '../Search/SearchBar'
import Crunchyroll from '../../assets/crunchyroll.png'
import Netflix from '../../assets/netflix.png'
import DubVsSubVote from '../Vote/Vote'

export const Anime = () => {
    const { id } = useParams<{ id: string }>()
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

    return (
        <div className="input-wrapper">
            <Search setIsTop={true} />
            <div className="anime-details">
                {error ? (
                    <p className="error">{error}</p>
                ) : animeData ? (
                    <>
                        <div className="topBlock">
                            <h1 className="title">{animeData.Title}</h1>
                            <div className="beans">
                                {animeData.Year.toString()} • {animeData.Rating}{' '}
                                • {animeData.Episodes.toString()} episodes
                            </div>
                        </div>
                        <div className="descBlock">
                            <img
                                className="animeImage"
                                src={animeData.Image}
                            ></img>
                            <div className="middle">
                                <div className="genres">
                                    {animeData.Genres.map((genre) => (
                                        <div
                                            className="genre-badge"
                                            key={genre.Name}
                                        >
                                            {genre.Name}
                                        </div>
                                    ))}
                                </div>
                                <div className="text">
                                    <h1 className="synopsisTitle">Synopsis</h1>
                                    <h2 className="synopsis">
                                        {animeData.Synopsis}
                                    </h2>
                                    <h1 className="streamingTitle">
                                        Where to watch...
                                    </h1>
                                    <div className="streamingLogos">
                                        {animeData.Streaming.map(
                                            (stream, index) => {
                                                if (
                                                    stream.Name ===
                                                        'Crunchyroll' ||
                                                    stream.Name === 'Netflix'
                                                ) {
                                                    return (
                                                        <a
                                                            key={index}
                                                            href={stream.URL}
                                                        >
                                                            <img
                                                                className="streamingLogo"
                                                                src={
                                                                    stream.Name ===
                                                                    'Crunchyroll'
                                                                        ? Crunchyroll
                                                                        : Netflix
                                                                }
                                                                alt={
                                                                    stream.Name
                                                                }
                                                            />
                                                        </a>
                                                    )
                                                }

                                                return null
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="votes">
                            <DubVsSubVote
                                malId={animeData.MalID}
                            ></DubVsSubVote>
                        </div>
                        <div className="trailerSection">
                            <iframe
                                className="player"
                                src={animeData.Trailer}
                                frameBorder="0"
                            ></iframe>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    )
}

export default Anime
