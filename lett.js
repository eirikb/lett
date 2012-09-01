var parser = require('./parser.js');
var builder = require('./builder.js');

module.exports = function(code, obj) {
    var tree = parser.parse(code);
    var build = builder.build(tree, obj);

    function runAll(o) {
        switch (typeof o) {
        case 'object':
            Object.keys(o).forEach(function(k) {
                o[k] = runAll(o[k]);
            });
            break;
        default:
            if (o && o.torun) return o();
            break;
        }
        return o;
    }

    if (build) {
        runAll(obj);
        if (build.torun) build = build();
    }

    return build;
};
