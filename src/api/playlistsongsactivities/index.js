const PlaylistSongsActivitesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsongsactivities',
  version: '1.0.0',
  register: async (server, { playlistSongsActivitesService, playlistsService }) => {
    const playlistSongsActivitesHandler = new PlaylistSongsActivitesHandler(
      playlistSongsActivitesService, playlistsService,
    );

    server.route(routes(playlistSongsActivitesHandler));
  },
};
