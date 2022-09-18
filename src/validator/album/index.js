const InvariantError = require('../../exception/Invarianterror');
const { AlbumPayloadSchema } = require('./schema');

const AlbumValidator = {
  validateNotePayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
