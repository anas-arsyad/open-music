require('dotenv').config();
const Hapi = require('@hapi/hapi');
const album = require('./api/album');
const songs = require('./api/songs');
// const NotesService = require('./services/inMemory/NoteService');
const AlbumService = require('./services/postgres/AlbumService');
const SongsService = require('./services/postgres/SongsService');
const AlbumValidator = require('./validator/album');
const SongsValidator = require('./validator/songs');

const init = async () => {
  const albumService = new AlbumService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.register({
    plugin: album,
    options: {
      service: albumService,
      validator: AlbumValidator,
    },
  });
  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
