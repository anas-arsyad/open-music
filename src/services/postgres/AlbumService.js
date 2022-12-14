const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');
const InvariantError = require('../../exception/Invarianterror');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exception/NotFoundError');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbum() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(((item) => ({
      id: item.id,
      name: item.name,
      year: item.year,
    })));
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const querySongs = await this._pool.query({
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    });
    const songs = querySongs.rows.map(mapDBToModel);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    const files = fs.readdirSync(path.join(__dirname, '../../api/uploads/file/pictures'));
    const fileName = files.find((item) => item.includes(id));
    return {
      ...result.rows.map(((item) => ({
        id: item.id,
        name: item.name,
        year: item.year,
        coverUrl: fileName ? `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${fileName}` : null,
      })))[0],
      songs,
    };
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NotesService;
