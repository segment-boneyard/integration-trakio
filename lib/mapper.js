
/**
 * Module dependencies.
 */

var extend = require('extend');

/**
 * Map `identify`.
 *
 * @param {Identify} identify
 * @return {Object}
 * @api private
 */

exports.identify = function(identify){
  return {
    data: {
      distinct_id: id(identify),
      properties: traits(identify)
    }
  };
};

/**
 * Map `track`.
 *
 * @param {Track} track
 * @return {Object}
 * @api private
 */

exports.track = function(track){
  return {
    data: {
      distinct_id: id(track),
      event: track.event(),
      properties: track.properties(),
      time: track.timestamp().toISOString()
    }
  };
};

/**
 * Map `alias`.
 *
 * @param {Alias} alias
 * @return {Object}
 * @api private
 */

exports.alias = function(alias){
  return {
    data: {
      distinct_id: alias.from(),
      alias: alias.to()
    }
  };
};

/**
 * Id.
 *
 * @param {Facade} message
 * @return {String}
 * @api private
 */

function id(message){
  return message.userId() || message.sessionId();
}

/**
 * Format traits.
 *
 * @param {Identify} identify
 * @return {Object}
 * @api private
 */

function traits (identify) {
  return extend(identify.traits(), {
    email: identify.email(),
    avatar_url: identify.avatar(),
    name: identify.name(),
    gender: identify.gender(),
    position: identify.position(),
    company: identify.proxy('traits.company'),
    positions: identify.proxy('traits.positions'),
    industry: identify.proxy('traits.industry'),
    location: identify.proxy('traits.location'),
    languages: identify.proxy('traits.languages'),
    birthday: identify.birthday(),
    tags: identify.proxy('traits.tags'),
    headline: identify.proxy('traits.headline'),
    account_id: identify.proxy('traits.account')
  });
}
