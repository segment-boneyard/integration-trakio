
/**
 * Module dependencies.
 */

var integration = require('segmentio-integration');
var mapper = require('./mapper');

/**
 * Expose `TrakIO`
 */

var TrakIO = module.exports = integration('trak.io')
  .endpoint('https://api.trak.io/v1')
  .ensure('settings.token')
  .channels(['server'])
  .mapper(mapper)
  .retries(2);

/**
 * Identify.
 *
 * @param {Identify} identify
 * @param {Object} settings
 * @param {Function} fn
 * @api private
 */

TrakIO.prototype.identify = request('/identify');

/**
 * Track.
 *
 * @param {Track} track
 * @param {Object} settings
 * @param {Function} fn
 * @api private
 */

TrakIO.prototype.track = request('/track');

/**
 * Alias.
 *
 * @param {Alias} alias
 * @param {Object} settings
 * @param {Function} fn
 * @api private
 */

TrakIO.prototype.alias = request('/alias');

/**
 * Request.
 *
 * @param {String} path
 * @return {Function}
 * @api private
 */

function request(path){
  return function(payload, fn){
    return this
      .post(path)
      .set('X-Token', this.settings.token)
      .type('json')
      .send(payload)
      .end(this.handle(fn));
  };
}
