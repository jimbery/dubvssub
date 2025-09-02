import React from 'react'
import { Search } from '../components/search/search-bar'
import { useParams } from 'react-router'
import Anime from '../components/anime/anime1'

const AnimePage: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    return (
        <>
            <Search setIsTop={true}></Search>
            <Anime id={id ?? ''}></Anime>
        </>
    )
}

export default AnimePage
