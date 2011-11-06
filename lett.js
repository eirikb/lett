var lettlib = require('./lib.js');

function build(code) {
    var o = {};

    while (code.length > 0) {
        var clips, sides = splitFirst(code, [':', '{']),
        result = sides[sides.length - 1],
        current = sides.length > 1 ? path(sides[0].split('.'), o) : {};

        clips = clip(result, ['{', '}']);
        console.log(clips);
        if (clips) {
            current = result.slice(clips[0] + 1, clips[1]);
            code = result.slice(clips[1] + 1).trim();
            console.log(code);
            code = '';
        } else {
            current = result;
            code = '';
        }
    }
    console.log(o)
}

function path(path, parent) {
    path.forEach(function(name) {
        if (typeof parent[name] === 'object') {
            parent = parent[name];
        } else {
            parent = parent[name] = {};
        }
    });
    return parent;
}

function splitFirst(code, splits) {
    var min;
    indexOfAll(code, splits).forEach(function(i) {
        if (i >= 0 && (!min || i < min)) {
            min = i;
        }
    });
    return [code.slice(0, min), code.slice(min + 1)].filter(function(s) {
        s = s.trim();
        return s.length > 0 ? s: false;
    });
}

function indexOfAll(code, targets) {
    var c, i, imsy = false, indexes = [],
    outside = ["'", '"'];

    for (i = 0; i < code.length; i++) {
        c = code.charAt(i);
        if (outside.indexOf(c) >= 0) {
            imsy = imsy ? false: c;
        } else if (!imsy) {
            if (targets.indexOf(c) >= 0) {
                indexes.push(i);
            }
        }
    }
    return indexes;
}

function clip(code, targets) {
    var level = 0;
    return indexOfAll(code, targets).filter(function(i, j) {
        level += code.charAt(i) === '{' ? 1 : -1;
        return j === 0 || level === 0;
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

