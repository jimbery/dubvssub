const axios = require('axios');
const express = require('express');

const app = express();
const port = 3000;
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'dubvsubdb',
  password: 'brighton1',
  port: 5432,
});

client.connect((err) => {
  if (err) throw err;
  console.log('Connected to DB!');
});

const updateDB = async (animeData) => {
  const animeDataJson = JSON.parse(animeData);
  const animeTitle = animeDataJson.title;
  const animeId = animeDataJson.id;
  const animeSynopsis = animeDataJson.synopsis;
  const animeYear = animeDataJson.year;
  const imgUrl = animeDataJson.imageUrl;
  await client.query(
    'INSERT INTO rating_page(TITLE, ID, SYNOPSIS, YEAR, IMG_URL) VALUES($1, $2, $3, $4, $5) RETURNING *',
    [animeTitle, animeId, animeSynopsis, animeYear, imgUrl],
    (err, res) => {
      console.log(err, res);
    },
  );
};

const checkDB = (animeData) => {
  const animeId = JSON.parse(animeData).id;
  client.query(
    'SELECT * FROM rating_page WHERE ID = $1',
    [animeId],
    (err, result) => {
      if (result.rows.length === 0) {
        updateDB(animeData);
      }
    },
  );
};

// Search
app.get('/search', async (req, res) => {
  const usedData = [];
  const search = req.query.q;
  await axios
    .get(`https://api.jikan.moe/v4/anime?q=${search}&limit=10`)
    .then((result) => {
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
      }
    })
    .catch((error) => {
      throw error;
    });
  res.send(usedData);
});

// get anime data
app.get('/anime', async (req, res) => {
  const animeId = req.query.id;
  const animeData = [];

  await axios
    .get(`https://api.jikan.moe/v4/anime/${animeId}`)
    .then((result) => {
      const { data } = result.data;
      let animeTitle = '';

      if (data.title_english !== null) {
        animeTitle = data.title_english;
      } else {
        animeTitle = data.title;
      }
      animeData.push(
        `{ "title": "${animeTitle}", "id": "${data.mal_id}", "synopsis": "${data.synopsis}", "imageUrl": "${data.images.jpg.image_url}", "year": ${data.year}}`,
      );
      console.log(JSON.parse(animeData));
      checkDB(animeData);
    })
    .catch((error) => {
      throw error;
    });

  res.send(JSON.parse(animeData));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = updateDB;
