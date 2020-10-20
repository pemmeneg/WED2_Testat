var classic = require('classic');

var NoDBExtension = require('./lib/extension');


var NoDB = classic({
  constructor: function NoDB(extensions) {
    var next = null;

    // chain extensions
    for (var i = extensions.length - 1; i >= 0; i--) {
      next = new NoDBExtension(extensions[i], next);
    }

    // only need to reference the first extension
    this._top = next;
  },


  put: function(key, value, cb) {
    this._top.put(key, value, cb);
  },


  del: function(key, cb) {
    this._top.del(key, cb);
  },


  get: function(key, cb) {
    this._top.get(key, cb);
  }
});


module.exports = function nodb(extensions) {
  return new NoDB(extensions);
};
