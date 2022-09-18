const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/Invarianterror');
const { mapDBToModel, mapDBToModelById } = require('../../utils');
const NotFoundError = require('../../exception/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongs({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5 , $6 , $7,$8,$9 ) RETURNING id',
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration || null,
        albumId || null,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs(request) {
    const { title, performer } = request.query;
    let query = 'SELECT * FROM songs where 1=1 ';
    if (title) query += `AND title ilike '%${title}%'`;
    if (performer) query += `AND performer ilike '%${performer}%'`;
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async getSongsById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Songs tidak ditemukan');
    }

    return result.rows.map(mapDBToModelById)[0];
  }

  async editSongsById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3,performer=$4,duration=$5,album_id=$6,updated_at=$7 WHERE id = $8 RETURNING id',
      values: [
        title,
        year,
        genre,
        performer,
        duration || null,
        albumId || null,
        updatedAt,
        id,
      ],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Songs. Id tidak ditemukan');
    }
  }

  async deleteSongsById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Songs gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
