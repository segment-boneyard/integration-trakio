
var Test = require('segmentio-integration-tester');
var helpers = require('./helpers');
var facade = require('segmentio-facade');
var mapper = require('../lib/mapper');
var should = require('should');
var assert = require('assert');
var extend = require('extend');
var TrakIO = require('..');

describe('trak.io', function(){
  var settings;
  var test;
  var tio;

  beforeEach(function(){
    settings = { token: '740d36a79fb593bbc034a3ac934bc04f5a591c0c' };
    tio = new TrakIO(settings);
    test = Test(tio, __dirname);
  });

  it('should have the correct settings', function(){
    test
      .name('trak.io')
      .endpoint('https://api.trak.io/v1')
      .ensure('settings.token')
      .channels(['server'])
      .retries(2);
  });

  describe('.validate()', function () {
    it('should be invalid if .token is missing', function(){
      delete settings.token;
      test.invalid({}, settings);
    });

    it('should be valid if settings are complete', function(){
      test.valid({}, settings);
    });
  });

  describe('mapper', function(){
    describe('identify', function(){
      it('should map basic identify', function(){
        test.maps('identify-basic');
      });

      it('should map anonymous identify', function(){
        test.maps('identify-anonymous');
      });
    });

    describe('track', function(){
      it('should map basic track', function(){
        test.maps('track-basic');
      });

      it('should map anonymous track', function(){
        test.maps('track-anonymous');
      });
    });

    describe('alias', function(){
      it('should map basic alias', function(){
        test.maps('alias-basic');
      });
    });
  });

  describe('.track()', function () {
    it('should get a good response from the API', function(done){
      var track = helpers.track();
      test
        .set(settings)
        .track(track)
        .sends({
          data: {
            distinct_id: track.userId(),
            event: track.event(),
            properties: track.properties(),
            time: track.timestamp().toISOString()
          }
        })
        .expects(200, done);
    });
  });

  describe('.identify()', function () {
    it('should get a good response from the API', function(done){
      var identify = helpers.identify();
      test
        .set(settings)
        .identify(identify)
        .sends({
          data: {
            distinct_id: identify.userId(),
            properties: extend(identify.traits(), {
              email: identify.email(),
              name: identify.name(),
              gender: identify.proxy('traits.gender'),
              position: identify.proxy('traits.position'),
              company: identify.proxy('traits.company'),
              positions: identify.proxy('traits.positions'),
              industry: identify.proxy('traits.industry'),
              location: identify.proxy('traits.location'),
              languages: identify.proxy('traits.languages'),
              birthday: identify.proxy('traits.birthday'),
              tags: identify.proxy('traits.tags'),
              headline: identify.proxy('traits.headline'),
              account_id: identify.proxy('traits.account')
            })
          }
        })
        .expects(200, done);
    });
  });

  describe('.alias()', function () {
    it('should get a good response from the api', function(done){
      var alias = helpers.alias();
      test
        .set(settings)
        .alias(alias)
        .sends({
          data: {
            distinct_id: alias.from(),
            alias: alias.to()
          }
        })
        .expects(200, done);
    });
  });
});
