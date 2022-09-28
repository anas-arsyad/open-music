const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/Invarianterror');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exception/NotFoundError');

class PlaylistsongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistsong(songId, playlistId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistsongById(id) {
    const query = {
      text: `SELECT playlistsongs.*, songs.title, songs.performer FROM playlistsongs LEFT JOIN songs ON songs.id = playlistsongs.song_id 
      WHERE playlistsongs.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    const queryPlylist = {
      text: `
      select p.id,p."name" ,u.username  from users u 
      join playlists p on u.id =p."owner"
      where p.id= $1`,
      values: [id],
    };
    const resultPlaylist = await this._pool.query(queryPlylist);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return {
      playlist: {
        id: resultPlaylist.rows[0].id,
        name: resultPlaylist.rows[0].name,
        username: resultPlaylist.rows[0].username,
        songs: result.rows.map(mapDBToModel),
      },
    };
  }

  async deletePlaylistsong(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }
}

module.exports = PlaylistsongsService;
