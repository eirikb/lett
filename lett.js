var lettlib = require('./lib.js');

function build() {;
    [
{
        s: 'hello world',
        e: false
    },
    {
        s: 'omg { haha }',
        e: [4, 11]
    },
    {
        s: ' This " is a { real test }',
        e: false
    },
    {
        s: "for ' bosses {' and { girls }",
        e: [20, 28]
    },
    {
        s: ' and "\n bosses { of " { this { is { the } test! } }',
        e: [22, 50]
    },
    {
        s: 'gi"girl{s',
        e: false
    },
    {
        s: 'gi"girl"{"{"{s}}',
        e: [8, 15]
    }].forEach(function(c) {
        var i = clip(c.s, /{/, /}/),
        s = c.s.replace(/\n/, '');
        if (i === false || (Array.isArray(i) && c.e[0] === i[0] && c.e[1] === i[1])) {
            console.log('OK! ', s, '\t\t', i, '===', c.e);
        } else {
            console.log('ERROR! ', s, '\t\t', i, '!==', c.e);
        }
    });
}

function clip(code, regexFrom, regexTo) {
    var i1, i2, start = safeIndexOf(code, ['{']),
    pos = start + 1,
    count = start >= 0 ? 1: - 1;

    while (count > 0 && pos > 0) {
        i1 = safeIndexOf(code, ['{'], pos);
        i2 = safeIndexOf(code, ['}'], pos);
        pos = Math.max(i1, i2) + 1;
        count += (i1 >= 0) && i1 < i2 ? 1: - 1;
    }
    pos--;
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
}

function ass(path, parent, obj) {
    var paths = path.split('.');
    paths.forEach(function(name, i) {
        if (i < paths.length - 1) {
            if (typeof parent[name] === 'object') {
                parent = parent[name];
            } else {
                parent = parent[name] = {};
            }
        } else {
            parent[name] = build(obj);
        }
    });
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
    // TODO: Remove, simple fix for comments
    code = code.replace(/;.*\n/g, '');

    return build(code);
};

