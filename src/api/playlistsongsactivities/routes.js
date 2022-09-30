const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: handler.getPlaylistSongActivitiesByPlaylistIdHandler,
    options: {
      auth: 'app_jwt',
    },
  },
];

module.exports = routes;
