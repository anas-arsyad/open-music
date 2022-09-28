const {
  PostPlaylistsPayloadSchema,
  PostPlaylistsSongIdPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exception/Invarianterror');

const AuthenticationsValidator = {
  validatePostPlaylistsPayloadSchema: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostPlaylistsSongIdPayloadSchema: (payload) => {
    const validationResult = PostPlaylistsSongIdPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
