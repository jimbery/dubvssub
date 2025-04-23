import React from 'react'
import { Helmet } from 'react-helmet'
import { Search } from '../components/Search/SearchBar'


const Home = () => {
    return (
      <>
        <Helmet>
          <title>Dub vs Sub</title>
          <meta
            name="description"
            content="Compare anime dubs and subs side by side. Vote for your favourite version and see community rankings!"
          />
        </Helmet>
        <Search setIsTop={false} />
      </>
    )
  }

export default Home
