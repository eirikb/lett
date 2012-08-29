var parser = require('./parser.js');
var builder = require('./builder.js');

module.exports = function(code) {
    var tree = parser.parse(code);
    var build = builder.build(tree);

    if (build.torun) build = build();
    return build;
};

