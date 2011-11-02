var fs = require('fs'),
sys = require('sys');

var lett = require('../lett.js');

fs.readFile(process.argv[2], function(e, d) {
    console.log(sys.inspect(lett.letteval(d.toString()), true, null));
});

