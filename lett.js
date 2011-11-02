var lettlib = require('./lib.js'),
father = {};

function build(code, parent) {
    var i, s, l, r, m, i, i1 = code.indexOf(':'),
    i2 = code.indexOf('{');

    if (i1 >= 0 || i2 >= 0) {
        if (i2 < 0 || i1 < i2) {
            m = code.slice(0, i1).trim();
            if ((l = m.split('.')).length > 0) {
                for (i = 0; i < l.length - 1; i++) {
                    r = l[i];
                    if (!parent[r]) {
                        parent[r] = {};
                    }
                    parent = parent[r];
                }
                m = l[l.length - 1];
            }
            if (m.match(/\[.*\]/)) {
                i = m.indexOf('[');
                r = m.slice(i + 1, m.indexOf(']')).split(' ');
                m = m.slice(0, i);
                parent[m] = function() {
                    var i, s = '';
                    for (i = 0; i < arguments.length; i++) {
                        s += arguments[i];
                    }
                    return exec(s);
                }
            } else {
                parent[m] = build(code.slice(i1 + 1));
            }
        } else {
            parent = {};
            if (Object.keys(father).length === 0) {
                father = parent;
            }
            code.slice(code.indexOf('{') + 1, code.indexOf('}')).
            split(',').forEach(function(c) {
                build(c, parent);
            });
            return parent;
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

function exec(b, parent) {
    var i, m, t, i = b.indexOf('(');
    m = b.slice(0, i);
    b = b.slice(i + 1, b.lastIndexOf(')')),
    ready = function(b) {
        var a = [];
        while (b.length > 0) {
            i = b.indexOf(' ');
            if (i >= 0) {
                t = b.slice(0, i);
                b = b.slice(i + 1);
            } else {
                t = b;
                b = '';
            }
            if (t.match(/\(/) && b.match(/\)/)) {
                i = b.indexOf(')') + 1;
                t += ' ' + b.slice(0, i);
                b = b.slice(i);
            }
            a.push(assign(t));
        }
        return a;
    };

    if (lettlib[m]) {
        b = lettlib[m].apply(this, ready(b));
    } else if (father[m]) {
        father[m].apply(this, ready(b));
    }
    return b;
}

exports.letteval = function(code) {
    b = build(code, father);
    return Object.keys(father).length > 0 ? father: b;
};

