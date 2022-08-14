const axios = require('axios');
const express = require('express');

const app = express();
const port = 3000;
const { Pool } = require('pg');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const clientCredentials = {
  user: 'postgres',
  host: 'localhost',
  database: 'dubvsubdb',
  password: 'brighton1',
  port: 5432,
};

const updateDB = async (animeData) => {
  const pool = new Pool(clientCredentials);
  const animeDataJson = JSON.parse(animeData);
  const animeTitle = animeDataJson.title;
  const animeId = animeDataJson.id;
  const animeSynopsis = animeDataJson.synopsis;
  const animeYear = animeDataJson.year;
  const imgUrl = animeDataJson.imageUrl;
  let output;
  await pool.query(
    'INSERT INTO rating_page(TITLE, ID, SYNOPSIS, YEAR, IMG_URL, DUB_RATING, SUB_RATING) VALUES($1, $2, $3, $4, $5, 0, 0) RETURNING *',
    [animeTitle, animeId, animeSynopsis, animeYear, imgUrl])
    .then((res) => {
      output = res;
      console.log(output);
    });
    
  await pool.end();
  return output;
};

const checkDB = async (animeData) => {
  const pool = new Pool(clientCredentials);
  const animeId = JSON.parse(animeData).id;
  // let entryExists = 'doot';
  let output;
  await pool.query('SELECT * FROM rating_page WHERE ID = $1', [animeId])
    .then(async (result) => {
      if (result.rows.length === 0) {
        output = await updateDB(animeData);
      } else {
        output = result;
      }
      console.log(output);
    });
  await pool.end();
  return output;
};

const SQLCheckDB = (animeId, animeData) => {
  const pool = new Pool(clientCredentials);
  let output;
  let entryExists;
  pool.query(
    'SELECT * FROM rating_page WHERE ID = $1',
    [animeId],
    (err, result) => {
      if (result.rows.length === 0) {
        entryExists = 'false';
        // console.log(entryExists);
        updateDB(animeData);
      } else {
        entryExists = 'true';
        output = result;
      }

      // console.log(result);
      // console.log(output);
    },
  );
  console.log(output);
  pool.end();
  return (output, entryExists);
};

// Search
app.get('/search', async (req, res) => {
  const usedData = [];
  const search = req.query.q;
  let dbData;
  await axios
    .get(`https://api.jikan.moe/v4/anime?q=${search}&limit=10`)
    .then(async (result) => {
      const listOfAnimes = result.data.data;

      for (let i = 0; i < listOfAnimes.length; i += 1) {
        const data = listOfAnimes[i];
        let animeTitle = '';
        if (data.title_english !== null) {
          animeTitle = data.title_english;
        } else {
          animeTitle = data.title;
        }

        usedData.push(
          `{ "title": "${animeTitle}", "id": "${data.mal_id}", "synopsis": "${data.synopsis}", "imageUrl": "${data.images.jpg.image_url}"}`,
        );

        console.log(usedData);
        console.log(dbData);
      }
    })
    .catch((error) => {
      throw error;
    });
  res.send(dbData);
});

// get anime data
app.get('/anime', async (req, res) => {
  const animeId = req.query.id;
  const animeData = [];
  let dbData;

  await axios
    .get(`https://api.jikan.moe/v4/anime/${animeId}`)
    .then(async (result) => {
      const { data } = result.data;
      let animeTitle = '';
      const animeSynopsis = data.synopsis.replace(/(["])/g, '\\$1');

      if (data.title_english !== null) {
        animeTitle = data.title_english;
      } else {
        animeTitle = data.title;
      }

      animeData.push(
        `{ "title": "${animeTitle}", "id": "${data.mal_id}", "synopsis": "${animeSynopsis}", "imageUrl": "${data.images.jpg.image_url}", "year": ${data.year}}`,
      );
      dbData = await checkDB(animeData);
      // console.log(dbData);
    })
    .catch((error) => {
      throw error;
    });

  await res.send(dbData);
});

// voting system
const addVote = async (vote, id) => {
  const pool = new Pool(clientCredentials);
  let queryString;
  let result;
  if (vote === 'dub') {
    queryString = 'UPDATE rating_page SET dub_rating = dub_rating + 1 WHERE id = $1 RETURNING *';
  } else if (vote === 'sub') {
    queryString = 'UPDATE rating_page SET sub_rating = sub_rating + 1 WHERE id = $1 RETURNING *';
  }
  console.log(id);
  await pool.query(
    queryString,
    [id],
  ).then((res) => {
    result = res;
  });
  await pool.end();
  return result;
};

app.get('/vote', async (req, res) => {
  const animeId = req.query.id;
  const { vote } = req.query;

  const voting = await addVote(vote, animeId);
  console.log(voting);
  res.send(voting);
});
