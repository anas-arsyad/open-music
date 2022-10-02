const ClientError = require('../../exception/ClientError');

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService) {
    this._userAlbumLikesService = userAlbumLikesService;

    this.postUserAlbumLikesHandler = this.postUserAlbumLikesHandler.bind(this);
    this.getUserAlbumLikesHandler = this.getUserAlbumLikesHandler.bind(this);
  }

  async postUserAlbumLikesHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: albumId } = request.params;

      await this._userAlbumLikesService.addUserAlbumLikes(
        credentialId,
        albumId,
      );

      const response = h.response({
        status: 'success',
        message: 'like berhasil ',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getUserAlbumLikesHandler(request, h) {
    try {
      // const { id: credentialId } = request.auth.credentials;
      const { id: albumId } = request.params;

      // await this._playlistsService.verifyCollaboration(playlistId, credentialId);
      const data = await this._userAlbumLikesService.getUserAlbumLikes(albumId);

      const response = h.response({
        status: 'success',
        data: {
          likes: data.likes,
        },
      });
      if (data.isChace) response.header('X-Data-Source', 'cache');
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = UserAlbumLikesHandler;
