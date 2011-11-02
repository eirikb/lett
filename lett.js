function build(code, parent) {
    var i, s, l, r, i1 = code.indexOf(':'),
    i2 = code.indexOf('{');

    if (i1 >= 0 || i2 >= 0) {
        if (i2 < 0 || i1 < i2) {
            parent[code.slice(0, i1).trim()]  = build(code.slice(i1 + 1));
        } else {
            var o = {};
            code.slice(code.indexOf('{') + 1, code.indexOf('}')).
            split(',').forEach(function(c) {
                build(c, o);
            });
            return o;
        }
    } else {
        return assign(code.trim());
    }
}

function assign(b) {
    var i, m;

    if (b.match(/^('|").*('|")$/)) {
        b = b.slice(1, b.length - 1);
    } else if (b.match(/true/i)) {
        b = true;
    } else if (b.match(/false/i)) {
        b = false;
    } else if (b.match(/.*\(.*\).*/ig)) {
        i = b.indexOf('(');
        m = b.slice(0, i);
        b = b.slice(i + 1, b.indexOf(')'));
        if (lettlib[m]) {
            b = lettlib[m].apply(this, b.split(' '));
        }
    } else {
        b = parseInt(b, 10);
    }
    return b;
}

var letteval = function(code) {
    var a = {},
    b = build(code, a);
    return Object.keys(a).length > 0 ? a: b;
};

if (typeof exports !== 'undefined') {
    exports.letteval = letteval;
    lettlib = require('./lib.js');
}

