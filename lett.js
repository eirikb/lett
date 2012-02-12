var lettlib = require('./lib.js');

function build(code) {
    var c, last, i = 0,
    o = {},
    left = '',
    part = '';

    while (i >= 0 && i < code.length) {
        last = i;
        i = safeIndexOf(code, [':', '\n', '{'], i + 1);
        c = code.charAt(i);

        if (c === ':') {
            left = code.slice(last, i).trim();
        } else if (c === '{') {
            part = clip(code, '{', '}', i);
            if (part) {
                i = part[1] + 1;
                part = code.slice(part[0] + 1, part[1]).trim();
                part = build(part);
                i++;
            }
        } else {
            if (i < 0) i = code.length;
            part = code.slice(last, i).trim();
        }
        if (part) {
            if (left) {
                assignSides(left, o, part);
                left = part = false;
            } else {
                return part;
            }
        }
    }

    return o;
}

function clip(code, from, to, start) {
    var start = safeIndexOf(code, [from], start),
    pos = start,
    count = start >= 0 ? 1: - 1;

    while (count > 0 && pos > 0) {
        pos = safeIndexOf(code, [from, to], pos + 1);
        count += code.charAt(pos) === from ? 1: - 1;
    }
    return start >= 0 && pos > 0 ? [start, pos] : false;
}

function safeIndexOf(code, targets, start) {
    var c, i, imsy = false,
    outside = ["'", '"'];

    for (i = start || 0; i < code.length; i++) {
        c = code.charAt(i);
        if (outside.indexOf(c) >= 0) {
            imsy = imsy ? false: c;
        } else if (!imsy) {
            if (targets.indexOf(c) >= 0) {
                return i;
            }
        }
    }
    return - 1;
}

function assignSides(path, parent, obj) {
    var paths = path.split('.');

    paths.slice(0, paths.length - 1).forEach(function(name) {
        parent = parent[name] = {};
    });

    path = paths.slice(paths.length - 1)[0];

    if (typeof obj === 'object') {
        parent[path] = obj;
    } else {
        obj = obj.replace(/^\:/, '').trim();
        parent[path] = assign(obj);
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
    } else if (b.match(/ /)) {
        return b.split(' ').map(function(part) {
            return assign(part);
        });
    } else {
        b = parseInt(b, 10);
    }
    return b;
}

function exec(b, parent) {
    console.log('EXEC', b)
    var i, m, t, i = b.indexOf('(');
    m = b.slice(0, i);
    b = b.slice(i + 1, b.lastIndexOf(')'));

    function obj(str) {
        var o = this;
        str.split('.').forEach(function(part) {
            var p = o[part];
            if (!p) p = lettlib[part];
            o = p;
        });
        return o;
    }

    if (m) {
        b = assign(b);
        if (!Array.isArray(b)) b = [b];
        m = obj(m);
        return m.apply(null, b);
    } else {
        i = b.indexOf('(');
        m = b.slice(0, i).split(' ');
        b = b.slice(i);
        var t = m.pop();
        return function() {
            var x = t + b,
            a = arguments;
            m.forEach(function(p, i) {
                x = x.replace(p, a[i]);
            });
            return exec(x);
        };
    }
    return b;
}

exports.letteval = function(code) {
    // TODO: Remove, simple fix for comments
    code = code.replace(/;.*\n/g, '');

    return build(code);
};

