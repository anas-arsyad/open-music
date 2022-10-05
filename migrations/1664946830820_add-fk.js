/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint('songs', 'fk_songs.albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlistsongs', 'fk_playlistsongs.song.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

  pgm.addConstraint('collaborations', 'fk_collaborations.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
  pgm.dropConstraint('songs', 'fk_songs.albums.id');
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.song.id');
  pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.playlist.id');
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.user.id');
};
