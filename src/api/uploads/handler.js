const ClientError = require('../../exception/ClientError');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const data = request.payload.cover;
      const { albumId } = request.params;
      this._validator.validateImageHeaders(data.hapi.headers);

      await this._service.writeFile(data, albumId, data.hapi);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
        // data: {
        //   pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${fileName}`,
        // },
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

module.exports = UploadsHandler;
