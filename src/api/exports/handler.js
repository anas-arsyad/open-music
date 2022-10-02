const ClientError = require('../../exception/ClientError');

class ExportsHandler {
  constructor(service, validator, playlistsService, playlistsongsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    this._playlistsongsService = playlistsongsService;

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  async postExportSongsHandler(request, h) {
    try {
      this._validator.validateExportSongsPayload(request.payload);
      const { playlistId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this._playlistsService.verifyCollaboration(playlistId, userId);
      const playlistsongs = await this._playlistsongsService.getPlaylistsongById(playlistId);
      delete playlistsongs.playlist.username;
      const message = playlistsongs;
      await this._service.sendMessage('export:songs', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
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
}

module.exports = ExportsHandler;
