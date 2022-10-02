require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// api
const album = require('./api/album');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const playlistsongs = require('./api/playlistsongs');
const collaborations = require('./api/collaborations');
const playlistsongsactivities = require('./api/playlistsongsactivities');
const uploads = require('./api/uploads');
const _exports = require('./api/exports');
const useralbumlikes = require('./api/useralbumlikes');

// service
const AlbumService = require('./services/postgres/AlbumService');
const SongsService = require('./services/postgres/SongsService');
const UsersService = require('./services/postgres/UsersService');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsongsService = require('./services/postgres/PlaylistsongsService');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const PlaylistSongsActivitesService = require('./services/postgres/PlaylistSongsActivitesService');
const StorageService = require('./services/storage/StorageService');
const ProducerService = require('./services/rabbitmq/ProducerService');
const UserAlbumLikesService = require('./services/postgres/UserAlbumLikes');
const CacheService = require('./services/redis/CacheService');

// validator
const AlbumValidator = require('./validator/album');
const SongsValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');
const AuthenticationsValidator = require('./validator/authentications');
const PlaylistsValidator = require('./validator/playlists');
const PlaylistsongsValidator = require('./validator/playlistsongs');
const CollaborationsValidator = require('./validator/collaborations');
const UploadsValidator = require('./validator/uploads');
const ExportsValidator = require('./validator/exports');
const TokenManager = require('./tokenize/tokenManager');

const init = async () => {
  const albumService = new AlbumService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const playlistsongsService = new PlaylistsongsService();
  const collaborationsService = new CollaborationsService();
  const playlistSongsActivitesService = new PlaylistSongsActivitesService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/pictures'));
  const cacheService = new CacheService();
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);
  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('app_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });
  await server.register([
    {
      plugin: album,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        usersService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistsongs,
      options: {
        playlistsongsService,
        playlistsService,
        songsService,
        validator: PlaylistsongsValidator,
        playlistSongsActivitesService,
      },
    }, {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    }, {
      plugin: playlistsongsactivities,
      options: {
        playlistSongsActivitesService,
        playlistsService,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        playlistsService,
        playlistsongsService,
      },
    }, {
      plugin: useralbumlikes,
      options: {
        userAlbumLikesService,
      },
    },
  ]);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
