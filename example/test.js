var fs = require('fs'),
util = require('util');

var lett = require('../lett.js');

fs.readFile(process.argv[2], function(e, d) {
    console.log(util.inspect(lett.letteval(d.toString()), true, null));
});

