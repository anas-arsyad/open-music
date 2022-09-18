/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});
const mapDBToModelById = ({
  id,
  title,
  performer,
  year,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  performer,
  year,
  genre,
  duration,
  albumId: album_id,
});
module.exports = { mapDBToModel, mapDBToModelById };
