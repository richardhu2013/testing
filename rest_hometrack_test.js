'use strict';

var fs = require('fs');

var hometrackServer;
var hometrackClient = require('nodeunit-httpclient').create({
  host: 'ec2-34-211-33-122.us-west-2.compute.amazonaws.com',
  port: 8888,
  path: '/',
  status: 200
});

exports.rest_buildbot = {

  'hometrack server': (test) => {
    hometrackServer = require('./server.js')();
    hometrackServer.start(test.done);
  },

  'post a list of home addresses and return ones with workflow completed and type htv': (test) => {
    hometrackClient.post(
      test,
      'hometrack', {
        data: fs.readFileSync('./testfiles/request.json', 'utf8')
      }, (res) => {
        var reply = JSON.parse(res.body);
        test.equal(reply.response.length, 2);
        test.done();
      });
  },

  'verify wrong format json data is handled ': (test) => {
    hometrackClient.post(
      test,
      'hometrack', {
        data: {
          addr: 'somethingwrong'
        }
      }, {
        status: 400
      }, (res) => {
        var reply = JSON.parse(res.body);
        test.equal(reply.error, 'Could not decode request: JSON parsing failed');
        test.done();
      });
  },

  'quit homerack server': (test) => {
    hometrackServer.stop(test.done);
  }
};
