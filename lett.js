var parser = require('./parser.js');
var builder = require('./builder.js');

exports.lett = function(code) {
    var tree = parser.parse(code);
    return builder.build(tree);
};

