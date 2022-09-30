const PlaylistsongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongs',
  version: '1.0.0',
  register: async (server, {
    playlistsongsService, playlistsService, songsService, validator, playlistSongsActivitesService,
  }) => {
    const playlistsongsHandler = new PlaylistsongsHandler(
      playlistsongsService,
      playlistsService,
      songsService,
      validator,
      playlistSongsActivitesService,
    );
    server.route(routes(playlistsongsHandler));
  },
};
