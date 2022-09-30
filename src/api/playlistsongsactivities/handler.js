const ClientError = require('../../exception/ClientError');

class PlaylistSongsActivitesHandler {
  constructor(playlistSongsActivitesService, playlistsService) {
    this._playlistSongsActivitesService = playlistSongsActivitesService;
    this._playlistsService = playlistsService;

    this.getPlaylistSongActivitiesByPlaylistIdHandler = this
      .getPlaylistSongActivitiesByPlaylistIdHandler.bind(this);
  }

  async getPlaylistSongActivitiesByPlaylistIdHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._playlistsService.verifyCollaboration(playlistId, credentialId);
      const playlisActivitiestsongs = await this._playlistSongsActivitesService
        .getPlaylistSongActivitiesByPlaylistId(playlistId);

      return {
        status: 'success',
        data: playlisActivitiestsongs,
      };
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

module.exports = PlaylistSongsActivitesHandler;
