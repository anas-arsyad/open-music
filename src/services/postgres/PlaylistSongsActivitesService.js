const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/Invarianterror');
const NotFoundError = require('../../exception/NotFoundError');

class PlaylistSongsActivitesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivites({
    songId, playlistId, userId, action,
  }) {
    const id = `playlistsongactivities-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3,$4,$5,$6) RETURNING id',
      values: [id, playlistId, songId, userId, action, new Date().toISOString()],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('PlayList Activities song gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylistSongActivitiesByPlaylistId(id) {
    const query = {
      text: `SELECT u.username,s.title,psa.action,psa.time from playlist_song_activities psa 
      join users u on psa.user_id = u.id
      join songs s on psa.song_id=s.id
      WHERE psa.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return {
      playlistId: id,
      activities: result.rows,
    };
  }
}

module.exports = PlaylistSongsActivitesService;
