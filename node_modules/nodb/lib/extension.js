var classic = require('classic');
var has = require('has');


var NoDBExtension = classic({
  constructor: function NoDBExtension(ext, next) {
    this._middleware = has(ext, 'middleware') && ext.middleware || {};
    this._next = next;
  },


  put: function(key, value, cb) {
    var _this = this;

    if (_this._middleware.put) {
      return _this._middleware.put(key, value, function(key, value, cb) {
        _this._next.put(key, value, cb);
      }, cb);
    }

    _this.next.put(key, value, cb);
  },


  del: function(key, cb) {
    var _this = this;

    if (_this._middleware.del) {
      return _this._middleware.del(key, function(key, cb) {
        _this._next.del(key, cb);
      }, cb);
    }

    _this.next.del(key, cb);
  },


  get: function(key, cb) {
    var _this = this;

    if (_this._middleware.get) {
      return _this._middleware.get(key, function(key, cb) {
        _this._next.get(key, cb);
      }, cb);
    }

    _this.next.get(key, cb);
  }
});


module.exports = NoDBExtension;
