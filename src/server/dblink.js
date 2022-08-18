const { Pool } = require('pg');

const clientCredentials = {
  user: 'postgres',
  host: 'localhost',
  database: 'dubvsubdb',
  password: 'brighton1',
  port: 5432,
};

export const updateDB = async (animeData) => {
  const pool = new Pool(clientCredentials);
  const animeDataJson = JSON.parse(animeData);
  const animeTitle = animeDataJson.title;
  const animeId = animeDataJson.id;
  const animeSynopsis = animeDataJson.synopsis;
  const animeYear = animeDataJson.year;
  const imgUrl = animeDataJson.imageUrl;
  let output;
  if (
    animeId === null ||
    animeId === undefined ||
    animeTitle === null ||
    animeTitle === undefined
  ) {
    throw new Error('entry must contain value db and title');
  }
  await pool
    .query(
      'INSERT INTO rating_page(TITLE, ID, SYNOPSIS, YEAR, IMG_URL, DUB_RATING, SUB_RATING) VALUES($1, $2, $3, $4, $5, 0, 0) RETURNING *',
      [animeTitle, animeId, animeSynopsis, animeYear, imgUrl],
    )
    .then((res) => {
      output = res;
    });

  await pool.end();
  return output;
};

export const checkDB = async (animeData) => {
  const pool = new Pool(clientCredentials);
  const animeId = JSON.parse(animeData).id;
  let output;
  if (
    animeId === null ||
    animeId === undefined ||
    animeId === 0 ||
    typeof animeId !== 'number'
  ) {
    throw new Error('entry must contain valid id');
  }
  await pool
    .query('SELECT * FROM rating_page WHERE ID = $1', [animeId])
    .then(async (result) => {
      if (result.rows.length === 0) {
        output = await exports.updateDB(animeData);
      } else {
        output = result;
      }
    });
  await pool.end();
  return output;
};

// voting system
export const addVote = async (vote, id, add) => {
  const pool = new Pool(clientCredentials);
  let queryString;
  let result;
  let plusOrMinus;
  if ((vote !== 'dub' && vote !== 'sub') || typeof vote !== 'string') {
    throw new Error('vote must be dub or sub string');
  }
  if (id === null || id === undefined || id === 0 || typeof id !== 'number') {
    throw new Error('entry must contain valid id');
  }
  if (add !== true && add !== false) {
    throw new Error('add must be true or false boolean');
  }
  if (add === true) {
    plusOrMinus = '+';
  } else {
    plusOrMinus = '-';
  }
  if (vote === 'dub') {
    queryString = `UPDATE rating_page SET dub_rating = dub_rating ${plusOrMinus} 1 WHERE id = $1 RETURNING *`;
  } else if (vote === 'sub') {
    queryString = `UPDATE rating_page SET sub_rating = sub_rating ${plusOrMinus} 1 WHERE id = $1 RETURNING *`;
  }
  await pool.query(queryString, [id]).then((res) => {
    result = res;
  });
  await pool.end();
  return result;
};
