const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postUserAlbumLikesHandler,
    options: {
      auth: 'app_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getUserAlbumLikesHandler,
    // options: {
    //   auth: 'app_jwt',
    // },
  },
];

module.exports = routes;
