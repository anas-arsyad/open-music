const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, {
    service, validator, playlistsService, playlistsongsService,
  }) => {
    const exportsHandler = new ExportsHandler(service,
      validator, playlistsService, playlistsongsService);
    server.route(routes(exportsHandler));
  },
};
