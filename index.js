var os = require('os'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec,
  when = require('when'),
  util = require('util'),
  through2 = require('through2'),
  Buffers = require("buffers");


var self = module.exports = function(command, args, options) {
  var deferred = when.defer();
  
  if(args && !util.isArray(args)) {
    options = args;
  }
  args = args || [];
  options = options || {};
  
  
  var proc = os.platform() === 'win32' ? exec(command + ' ' + args, options, null) : spawn(command, args, options);
  var bufferCombined = new Buffers();
  var bufferErr = new Buffers();
  var bufferOut = new Buffers();

  var outStream = proc.stdout.pipe(through2(function(chunk, enc, callback) {
    bufferCombined.push(chunk);
    bufferOut.push(chunk);
    this.push(chunk);
    callback();
  }));
  if(options.out) {
    outStream.pipe(options.out);
  }
  
  var errStream = proc.stderr.pipe(through2(function(chunk, enc, callback) {
    bufferCombined.push(chunk);
    bufferErr.push(chunk);
    this.push(chunk);
    callback();
  }));
  if(options.err) {
    errStream.pipe(options.err);
  }

  proc.on('close', function (code) {
    if(code !== 0) {
      var err = new Error("Command '" + command + "' exited with code " + code);
      err.code = code;
      err.out = bufferOut.toString("utf8");
      err.err = bufferErr.toString("utf8");
      err.combined = bufferCombined.toString("utf8");

      deferred.reject(err);
    } else {
      deferred.resolve({
        code: code,
        out: bufferOut.toString("utf8"),
        err: bufferErr.toString("utf8"),
        combined: bufferCombined.toString("utf8")
      });
    }
  });

  return deferred.promise;
};