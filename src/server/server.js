const axios = require('axios');
const express = require('express');
const dblink = require('./dblink');

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Search
app.get('/search', async (req, res) => {
  const usedData = [];
  const search = req.query.q;
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
      dbData = await dblink.checkDB(animeData);
      // console.log(dbData);
    })
    .catch((error) => {
      throw error;
    });

  await res.send(dbData);
});

app.get('/vote', async (req, res) => {
  const animeId = req.query.id;
  const { vote } = req.query;
  const plusOrMinus = req.query.add;
  const voting = await dblink.addVote(vote, animeId, plusOrMinus);
  res.send(voting);
});
