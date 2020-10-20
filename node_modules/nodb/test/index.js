var assert = require('assert');
var sinon = require('sinon');
var nodb = require('..');


for (var k in assert) global[k] = assert[k];


describe('nodb', function() {
  describe('middleware', function() {
    var db, top, mid, bot;


    beforeEach(function() {
      top = {
        middleware: {
          put: function(key, value, next, cb) {
            next(key * 2, value / 2, function(r) { cb(true); });
          },
          del: function(key, next, cb) {
            next(key * 4, function(x, y) { cb(x, y / 3); });
          },
          get: function(key, next, cb) {
            next(key * 8, function(x, y) { cb(x, y * 10); });
          }
        }
      };
      mid = {
        middleware: {
          put: function(key, value, next, cb) {
            next(key * 2, value / 2, function(r) { cb(false); });
          },
          del: function(key, next, cb) {
            next(key * 4, function(x, y) { cb(x, y / 3); });
          },
          get: function(key, next, cb) {
            next(key * 8, function(x, y) { cb(x, y * 10); });
          }
        }
      };
      bot = {
        middleware: {
          put: function(key, value, next, cb) {
            cb(null);
          },
          del: function(key, next, cb) {
            cb(null, 9);
          },
          get: function(key, next, cb) {
            cb(null, 9);
          }
        }
      };

      sinon.spy(top.middleware, 'put');
      sinon.spy(mid.middleware, 'put');
      sinon.spy(bot.middleware, 'put');
      sinon.spy(top.middleware, 'del');
      sinon.spy(mid.middleware, 'del');
      sinon.spy(bot.middleware, 'del');
      sinon.spy(top.middleware, 'get');
      sinon.spy(mid.middleware, 'get');
      sinon.spy(bot.middleware, 'get');
      db = nodb([top, mid, bot]);
    });


    describe('put', function() {
      it('sends arguments through the middleware pipeline', function() {
        // callback argument wont matter because its only called by the
        // last middleware in the pipeline, which is a sinon spy
        db.put(2, 3, function() {});
        assert(top.middleware.put.calledWith(2, 3));
        assert(mid.middleware.put.calledWith(4, 1.5));
        assert(bot.middleware.put.calledWith(8, 0.75));
      });


      it('sends result back through the middleware pipeline', function(done) {
        // callback argument wont matter because its only called by the
        // last middleware in the pipeline, which is a sinon spy
        db.put(2, 3, function(r) {
          equal(true, r);
          done();
        });
      });
    });


    describe('del', function() {
      it('sends arguments through the middleware pipeline', function() {
        // callback argument wont matter because its only called by the
        // last middleware in the pipeline, which is a sinon spy
        db.del(5, function() {});
        assert(top.middleware.del.calledWith(5));
        assert(mid.middleware.del.calledWith(20));
        assert(bot.middleware.del.calledWith(80));
      });


      it('sends result back through the middleware pipeline', function(done) {
        // callback argument wont matter because its only called by the
        // last middleware in the pipeline, which is a sinon spy
        db.del(5, function(x, y) {
          equal(null, x);
          equal(1, y);
          done();
        });
      });
    });


    describe('get', function() {
      it('sends arguments through the middleware pipeline', function() {
        // callback argument wont matter because its only called by the
        // last middleware in the pipeline, which is a sinon spy
        db.get(5, function() {});
        assert(top.middleware.get.calledWith(5));
        assert(mid.middleware.get.calledWith(40));
        assert(bot.middleware.get.calledWith(320));
      });


      it('sends result back through the middleware pipeline', function(done) {
        // callback argument wont matter because its only called by the
        // last middleware in the pipeline, which is a sinon spy
        db.get(5, function(x, y) {
          equal(null, x);
          equal(900, y);
          done();
        });
      });
    });
  });
});
