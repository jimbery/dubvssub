import React, { useState, useEffect } from 'react'
import './Anime.css'
import '../Results/Results.css'
import GetAnime, { GetSearchAnimeOutput } from '../../routes/GetAnime' // Import your GetAnime function
// import icon from '../Sear./icon3.bmp'
import { useParams } from 'react-router-dom'

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
            const data = await GetAnime(Number(animeId)) // Pass the anime ID
            if (data instanceof Error || !data) {
                setError(data instanceof Error ? data.message : 'No data found')
            } else {
                setError('')
                setAnimeData(data)
            }
        } catch (err) {
            setError('An unexpected error occurred.')
        }
    }

    return (
        <div className="input-wrapper">
            <div className={`centered-container top`}>
                <div className="logo">
                    {/* <img src={icon} alt="Logo" className="icon" /> */}
                </div>
                <div className="anime-details">
                    {error ? (
                        <p className="error">{error}</p>
                    ) : animeData ? (
                        <div>
                            <h1>{animeData.Title}</h1>
                            <p>{animeData.Image}</p>
                            {/* Render additional anime details here */}
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Anime
