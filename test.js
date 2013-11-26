var expect = require('chai').expect,
  through2 = require('through2'),
  Buffers = require("buffers"),
  spawned = require('./index.js');

describe('spawned', function() {
  it('should return out/err/combined streams', function(done) {
    spawned('ps').then(function(res) {
      expect(res.out, "out").to.match(new RegExp(process.pid));
      expect(res.err, "err").to.be.empty;
      expect(res.combined, "combined").to.match(new RegExp(process.pid));
      done();
    }).otherwise(done);
  });


  it('should stream stdout', function(done) {
    var outBuff = new Buffers();
    spawned('ps', [], {
      out: through2(function(chunk, enc, cb) {
        outBuff.push(chunk);
        this.push(chunk);
        cb();
      }, function() {
        expect(outBuff.toString('utf-8'), "out").to.match(new RegExp(process.pid));
        done();
      })
    }).otherwise(done);
  });

  it('should reject promise in case of error', function(done) {
    var outBuff = new Buffers();
    spawned('grep', ['nosuchpattern', 'nosuchfile'])
      .then(function(res) {
        done(new Error("Should fail..."));
      }).otherwise(function(err) {
        expect(err.code).equal(2);
        expect(err.err).to.match(/No such file/)
        done();
      }).otherwise(done);
  });
});