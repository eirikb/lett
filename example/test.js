var fs = require('fs'),
util = require('util');

var lett = require('../lett.js');

fs.readFile(process.argv[2], function(e, d) {
    var l = lett.letteval(d.toString());
    console.log(util.inspect(l, true, null));

    console.log(l.my.first.lib.add(1, 2, 3))
});

