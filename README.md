# Synopsis

Smart wrapper around `child_process.spawn` using promises.

[![NPM](https://nodei.co/npm/spawned.png?downloads=true)](https://nodei.co/npm/spawned/)

[![Build Status](https://travis-ci.org/mariocasciaro/spawned.png)](https://travis-ci.org/mariocasciaro/spawned)
[![Coverage Status](https://coveralls.io/repos/mariocasciaro/spawned/badge.png)](https://coveralls.io/r/mariocasciaro/spawned)

## Usage

```javascript
var spawned = require('spawned');
spawned('echo', ['test'])
  .then(function(proc) {
    console.log("Did it work? " + ((proc.out.match(/test/))? "yes" : "no"));
  }).otherwise(function(err) {
    console.log("Boooooom");
    console.error(err.err);
  });
```


## API


#### spawn(command, [args], [options])

Spawn a new process and returns a promise.

* `command`: `String` the command to execute
* `args`: `Array` a list of arguments to pass to the command
* `options`: `Object` inherits the options from [child_process.spawn](http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
  plus these:
  * out: A `WriteableStream` receiving the `stdout` data
  * err: A `WriteableStream` receiving the `stderr` data

**Returns** a promise which:
* when **fullfilled** resolves to an object like:
  * `err`: `String` containing `stderr`
  * `out`: `String` containig `stdout`
  * `combined`: `String` containing the intermingled contents of `stdout` and `stderr`
  * `code`: `Number` the return code of the program
* when **rejected** resolved to an `Error` having the same properties as above.

---

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/mariocasciaro/spawned/trend.png)](https://bitdeli.com/free "Bitdeli Badge")