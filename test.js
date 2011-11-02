var fs = require('fs'),
    lett = require('./lett.js');

fs.readFile(process.argv[2], function(e, d) {
    console.log(lett.letteval(d.toString()));
});

