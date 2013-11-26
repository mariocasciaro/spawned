
var spawned = require('../');

spawned('echo', ['test'])
  .then(function(proc) {
    console.log("Did it work? " + ((proc.out.match(/test/))? "yes" : "no"));
  }).otherwise(function(err) {
    console.log("Boooooom");
    console.error(err.err);
  });