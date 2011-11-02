var lettlib = require('./lib.js');

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
    if (b.match(/^('|").*('|")$/)) {
        b = b.slice(1, b.length - 1);
    } else if (b.match(/true/i)) {
        b = true;
    } else if (b.match(/false/i)) {
        b = false;
    } else if (b.match(/.*\(.*\).*/ig)) {
        b = exec(b);
    } else {
        b = parseInt(b, 10);
    }
    return b;
}

function exec(b) {
    var i, m, t, a = [];
    i = b.indexOf('(');
    m = b.slice(0, i);
    b = b.slice(i + 1, b.indexOf(')') + 1);
    if (lettlib[m]) {
        while ((i = b.indexOf(' ')) >= 0) {
            t = b.slice(0, i);
            b = b.slice(i + 1);
            if (t.match(/\(/) && b.match(/\)/)) {
                t += ' ' + b.slice(0, b.indexOf(')'));
            }
            a.push(assign(t));
        }

        b = lettlib[m].apply(this, a);
    }
    return b;
}

exports.letteval = function(code) {
    var a = {},
    b = build(code, a);
    return Object.keys(a).length > 0 ? a: b;
};

