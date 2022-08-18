const { Pool } = require('pg');
const dblink = require('../../src/server/dblink');

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mClient) };
});

describe('updateDB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('successful request', async () => {
    const pool = new Pool();
    const mockData = '{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996" }';
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    await dblink.updateDB(mockData);
    expect(pool.query).toBeCalledWith('INSERT INTO rating_page(TITLE, ID, SYNOPSIS, YEAR, IMG_URL, DUB_RATING, SUB_RATING) VALUES($1, $2, $3, $4, $5, 0, 0) RETURNING *', ['test title', 7, 'test synopsis', '1996', 'http://testUrl.com']);
    expect(pool.end).toBeCalledTimes(1);
  });

  it('unsuccessful request, null title', async () => {
    const mockData = '{ "title": null, "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996" }';
    await expect(dblink.updateDB(mockData)).rejects.toThrowError('entry must contain value db and title');
  });

  it('unsuccessful request, null id', async () => {
    const mockData = '{ "title": "test title", "id": null, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996" }';
    await expect(dblink.updateDB(mockData)).rejects.toThrowError('entry must contain value db and title');
  });
});

describe('checkDB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('successful checkDB request - entry doesn\'t exist', async () => {
    const mockData = '{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996" }';
    const spy = jest.spyOn(dblink, 'updateDB').mockResolvedValueOnce({ id: 'testId' });

    const pool = new Pool();
    pool.query.mockResolvedValueOnce({ rows: [], rowCount: 0 });

    expect(await dblink.checkDB(mockData)).toStrictEqual({ id: 'testId' });
    expect(await spy).toHaveBeenCalledWith(mockData);
    expect(pool.query).toBeCalledWith('SELECT * FROM rating_page WHERE ID = $1', [7]);
    spy.mockRestore();
  });

  it('successful checkDB request - entry exists', async () => {
    const mockData = '{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996" }';
    const spy = jest.spyOn(dblink, 'updateDB');

    const pool = new Pool();
    pool.query.mockResolvedValueOnce({ rows: [{ test: 'doot', test2: 'doot2' }], rowCount: 2 });

    expect(await dblink.checkDB(mockData)).toStrictEqual({ rows: [{ test: 'doot', test2: 'doot2' }], rowCount: 2 });
    expect(spy).not.toBeCalled();
    expect(pool.query).toBeCalledWith('SELECT * FROM rating_page WHERE ID = $1', [7]);

    spy.mockRestore();
  });

  it('unsuccessful checkDB request - id is null', async () => {
    const mockData = '{ "title": "test title", "id": null, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996" }';

    await expect(dblink.checkDB(mockData)).rejects.toThrowError('entry must contain valid id');
  });

  it('unsuccessful checkDB request - id is string', async () => {
    const mockData = '{ "title": "test title", "id": "string", "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996" }';

    await expect(dblink.checkDB(mockData)).rejects.toThrowError('entry must contain valid id');
  });

  it('unsuccessful checkDB request - id is 0', async () => {
    const mockData = '{ "title": "test title", "id": 0, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996" }';

    await expect(dblink.checkDB(mockData)).rejects.toThrowError('entry must contain valid id');
  });
});

describe('addVote', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('add vote to dub', async () => {
    const pool = new Pool();

    pool.query.mockResolvedValueOnce('{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996", dub_rating: 1, sub_rating: 0}');

    expect(await dblink.addVote('dub', 7, true)).toBe('{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996", dub_rating: 1, sub_rating: 0}');

    expect(pool.query).toBeCalledWith('UPDATE rating_page SET dub_rating = dub_rating + 1 WHERE id = $1 RETURNING *', [7]);
  });
  it('remove vote from dub', async () => {
    const pool = new Pool();

    pool.query.mockResolvedValueOnce('{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996", dub_rating: 0, sub_rating: 0}');

    expect(await dblink.addVote('dub', 7, false)).toBe('{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996", dub_rating: 0, sub_rating: 0}');

    expect(pool.query).toBeCalledWith('UPDATE rating_page SET dub_rating = dub_rating - 1 WHERE id = $1 RETURNING *', [7]);
  });
  it('add vote to sub', async () => {
    const pool = new Pool();

    pool.query.mockResolvedValueOnce('{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996", dub_rating: 0, sub_rating: 1}');

    expect(await dblink.addVote('sub', 7, true)).toBe('{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996", dub_rating: 0, sub_rating: 1}');

    expect(pool.query).toBeCalledWith('UPDATE rating_page SET sub_rating = sub_rating + 1 WHERE id = $1 RETURNING *', [7]);
  });
  it('Remove vote from sub', async () => {
    const pool = new Pool();

    pool.query.mockResolvedValueOnce('{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996", dub_rating: 0, sub_rating: 0}');

    expect(await dblink.addVote('sub', 7, false)).toBe('{ "title": "test title", "id": 7, "synopsis": "test synopsis", "imageUrl": "http://testUrl.com", "year": "1996", dub_rating: 0, sub_rating: 0}');

    expect(pool.query).toBeCalledWith('UPDATE rating_page SET sub_rating = sub_rating - 1 WHERE id = $1 RETURNING *', [7]);
  });
  it('Vote is incorrect string', async () => {
    await expect(dblink.addVote('scrub', 7, false)).rejects.toThrowError('vote must be dub or sub string');
  });
  it('Vote is number', async () => {
    await expect(dblink.addVote(10, 7, false)).rejects.toThrowError('vote must be dub or sub string');
  });
  it('Vote is number', async () => {
    await expect(dblink.addVote(10, 7, false)).rejects.toThrowError('vote must be dub or sub string');
  });
  it('id is null', async () => {
    await expect(dblink.addVote('dub', null, false)).rejects.toThrowError('entry must contain valid id');
  });
  it('id is 0', async () => {
    await expect(dblink.addVote('dub', 0, false)).rejects.toThrowError('entry must contain valid id');
  });
  it('id is sting', async () => {
    await expect(dblink.addVote('dub', 'string', false)).rejects.toThrowError('entry must contain valid id');
  });
  it('add is not boolean (number)', async () => {
    await expect(dblink.addVote('dub', 7, 1)).rejects.toThrowError('add must be true or false boolean');
  });
  it('add is not boolean (string)', async () => {
    await expect(dblink.addVote('dub', 7, 'string')).rejects.toThrowError('add must be true or false boolean');
  });
});
