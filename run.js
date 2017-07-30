'use strict';

var server = require('./server')();
server.start(() => {
  console.log('Hometrack server started at 8888');
});

process.on('SIGINT', () => {
  console.log('Hometrack server ' + 'stopping...');
  server.stop(() => {
    console.log('Hometrack server ' + 'finished');
  });
});
