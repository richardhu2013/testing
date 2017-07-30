'use strict';

var Hapi = require('hapi');
var Path = require('path');
var async = require('async');
var _ = require('lodash');

module.exports = () => {
  var server = new Hapi.Server();
  server.connection({
    host: '0.0.0.0',
    port: 8888
  });

  server.register(require('inert'), (err) => {
    if (err) {
      console.log('Failed to load inert.');
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: {
      file: Path.join(__dirname, './public/index.html')
    }
  });

  server.route({
    method: 'POST',
    path: '/hometrack',
    handler: (request, reply) => {
      var isWrongFormat = false;
      // Allow payload:[addresses] and [addresses]
      var homes = request.payload.hasOwnProperty('payload') ? request.payload.payload : request.payload;
      if (!Array.isArray(homes)) {
        isWrongFormat = true;
      }
      if (isWrongFormat) {
        return reply({
          error: 'Could not decode request: JSON parsing failed'
        }).code(400);
      }

      var completedWorkflows = _.filter(homes, {
        workflow: 'completed',
        type: 'htv'
      });

      var filteredHomes = [];
      if (completedWorkflows !== undefined) {
        // concatenate address
        filteredHomes = _.map(completedWorkflows, (x) => {
          var objs = {};
          objs.concataddress = '';
          if (x.hasOwnProperty('address')) {
            var concataddress = '';
            if (x.address.hasOwnProperty('buildingNumber')) concataddress += x.address.buildingNumber;
            concataddress += ' ';
            if (x.address.hasOwnProperty('street')) concataddress += x.address.street;
            concataddress += ' ';
            if (x.address.hasOwnProperty('suburb')) concataddress += x.address.suburb;
            concataddress += ' ';
            if (x.address.hasOwnProperty('state')) concataddress += x.address.state;
            concataddress += ' ';
            if (x.address.hasOwnProperty('postcode')) concataddress += x.address.postcode;
            objs.concataddress = concataddress;
          }
          objs.type = x.type;
          objs.workflow = x.workflow;
          return objs;
        });
      }
      reply({
        response: filteredHomes
      });
    }
  });

  var start = (done) => {
    server.start(done);
  };

  var stop = (done) => {
    async.series([
      (next) => {
        server.stop({
          timeout: 1000
        }, next);
      }
    ], done);
  };

  return {
    start: start,
    stop: stop
  };
};
