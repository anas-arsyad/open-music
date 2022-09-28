const Joi = require('joi');

const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});
const PostPlaylistsSongIdPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PostPlaylistsPayloadSchema, PostPlaylistsSongIdPayloadSchema,
};
