var fs = require('fs'),
util = require('util');

var lett = require('../lett2.js');

fs.readFile(process.argv[2], function(e, d) {
    var l = lett(d.toString());
    console.log(util.inspect(l, true, null));
});

