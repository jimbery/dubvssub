import React, { useState, useEffect } from 'react'
import './Anime.css'
import '../Results/Results.css'
import GetAnime, { GetSearchAnimeOutput } from '../../routes/GetAnime' // Import your GetAnime function
import { useParams } from 'react-router-dom'
import { Search } from '../Search/SearchBar'
import Crunchyroll from './pngegg.png'
import Netflix from './netflix.png'

export const Anime = () => {
    const { id } = useParams<{ id: string }>() // Get the anime ID from the URL
    const [animeData, setAnimeData] = useState<GetSearchAnimeOutput | null>(
        null,
    )
    const [error, setError] = useState('')

    useEffect(() => {
        if (id) {
            getAnime(id) // Call getAnime with the dynamic ID
        }
    }, [id])

    const getAnime = async (animeId: string) => {
        try {
            console.log(Number(animeId))
            const data = await GetAnime(Number(animeId)) // Pass the anime ID
            console.log(data)
            if (data instanceof Error || !data) {
                setError(data instanceof Error ? data.message : 'No data found')
            } else {
                setError('')
                console.log(data.Streaming)
                setAnimeData(data)
            }
        } catch (err) {
            setError('An unexpected error occurred.')
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
                                                // Check if the provider is Netflix or Crunchyroll
                                                if (
                                                    stream.Name ===
                                                        'Crunchyroll' ||
                                                    stream.Name === 'Netflix'
                                                ) {
                                                    return (
                                                        <a
                                                            key={index} // Provide a unique key for each element
                                                            href={stream.URL} // Always use the stream's URL
                                                        >
                                                            <img
                                                                className="streamingLogo"
                                                                src={
                                                                    stream.Name ===
                                                                    'Crunchyroll'
                                                                        ? Crunchyroll
                                                                        : Netflix
                                                                } // Use Netflix logo for Netflix
                                                                alt={
                                                                    stream.Name
                                                                } // Provide an alt text based on the stream name
                                                            />
                                                        </a>
                                                    )
                                                }

                                                return null // Return null for other providers to not render anything
                                            },
                                        )}
                                    </div>
                                </div>
                            </div>
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
