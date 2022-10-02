const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exception/Invarianterror');
const NotFoundError = require('../../exception/NotFoundError');

class UserAlbumLikes {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addUserAlbumLikes(userId, albumId) {
    const id = `useralbumlikes-${nanoid(16)}`;
    const queryCheckAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };
    const resultAlbum = await this._pool.query(queryCheckAlbum);
    if (!resultAlbum.rows.length) throw new NotFoundError('album tidak ditemukan');

    const isLiked = await this.getUserAlbumLikesByUserId(userId, albumId);
    if (isLiked) {
      this.deleteUserAlbumLikes(userId, albumId);
      return this._cacheService.delete(`likes:${albumId}`);
    }

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Like gagal ditambahkan');
    }
    await this._cacheService.delete(`likes:${albumId}`);
    return result.rows[0].id;
  }

  async getUserAlbumLikes(albumId) {
    const { data } = await this._cacheService.get(`likes:${albumId}`);

    if (data) return { isChace: true, likes: +data };

    const query = {
      text: 'SELECT * FROM user_album_likes WHERE  album_id=$1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.set(`likes:${albumId}`, result.rows.length);
    return { likes: result.rows.length, isChace: false };
  }

  async getUserAlbumLikesByUserId(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id=$1 and album_id=$2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);

    return result.rows.length;
  }

  async deleteUserAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id=$1 and album_id=$2',
      values: [userId, albumId],
    };

    await this._pool.query(query);
  }
}

module.exports = UserAlbumLikes;
