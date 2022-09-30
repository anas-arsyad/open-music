const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/Invarianterror');
const NotFoundError = require('../../exception/NotFoundError');
const AuthorizationError = require('../../exception/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [
        id,
        name,
        owner,
      ],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations c on c.playlist_id  =playlist_id
      WHERE playlists.owner = $1 or c.user_id=$1
      GROUP BY playlists.id, users.username`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Playlist tidak ditemukan');

    // validasi user
    const queryUser = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [userId],
    };
    const resultUser = await this._pool.query(queryUser);
    if (userId && !resultUser.rows.length) throw new NotFoundError('User tidak ditemukan');

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyCollaboration(id, owner) {
    const queryCol = {
      text: `SELECT p."owner" ,c.user_id FROM playlists p
      LEFT JOIN users u ON p.owner = u.id
      left JOIN collaborations c on c.playlist_id  =playlist_id 
      WHERE p.id = $1 `,
      values: [id],
    };
    const resultCol = await this._pool.query(queryCol);
    if (!resultCol.rows.length) throw new NotFoundError('Playlist tidak ditemukan');
    if (![resultCol.rows[0].owner, resultCol.rows[0].user_id].includes(owner)) { throw new AuthorizationError('Anda tidak berhak mengakses resource ini'); }
  }
}

module.exports = PlaylistsService;
