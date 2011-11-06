var lettlib = require('./lib.js');

function build(code, level) {
    var o = {};

    while (code.length > 0) {
        var clips, lines, name, urrent, sides = splitFirst(code, [':', '{']),
        result = sides[sides.length - 1];

        if (sides) {
            clips = clip(result, ['{', '}']);
            if (clips.length > 0) {
                code = result.slice(clips[1] + 1).trim();
                result = result.slice(clips[0] + 1, clips[1]);
            } else {
                lines = splitFirst(result, '\n');
                if (lines.length > 1) {
                    result = lines[0].trim();
                    code = lines[1];
                } else {
                    result = sides[1];
                    code = '';
                }
            }
            ass(sides[0].replace(/\n/g, '').trim(), o, result);
        } else {
            return assign(code.trim());
        }
    }
    return o;
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

function splitFirst(code, splits) {
    var min;
    indexOfAll(code, splits).forEach(function(i) {
        if (i >= 0 && (!min || i < min)) {
            min = i;
        }
    });
    if (min) {
        return [code.slice(0, min), code.slice(min + 1)].filter(function(s) {
            s = s.trim();
            return s.length > 0 ? s: false;
        });
    } else {
        return false;
    }
}

function indexOfAll(code, targets) {
    var c, i, imsy = false,
    indexes = [],
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
        level += code.charAt(i) === '{' ? 1: - 1;
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

