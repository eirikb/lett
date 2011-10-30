var fs = require('fs'),
    lett = require('./lett.js');

fs.readFile(process.argv[2], function(e, d) {
    d = d.toString();
    console.log(lett.run(d));
});

