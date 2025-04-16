import React from 'react'
import { Search } from '../components/Search/SearchBar'
import { useParams } from 'react-router'
import Anime from '../components/Anime/Anime'

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
