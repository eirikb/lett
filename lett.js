function build(parent, code) {
    var i, s, l, r, i1 = code.indexOf(':'),
    i2 = code.indexOf('{');

    if (i1 < 0 && i2 < 0) {
        return assign(code.trim());
    }

    if (i1 < 0) {
        i1 = Number.MAX_VALUE;
    }
    if (i2 < 0) {
        i2 = Number.MAX_VALUE;
    }

    if (i1 < i2) {
        i = code.indexOf(':');
        var a = {};
        parent[code.slice(0, i).trim()] = a;
        parent = a;
        a = build(parent, code.slice(i + 1));
        return a;
    } else {
        var o = {};
        code.slice(code.indexOf('{') + 1, code.indexOf('}')).split(',').forEach(function(c) {
            build(o, c);
        });
        return o;
    }
}

function assign(b) {
    if (b.match(/^('|").*('|")$/)) {
        b = b.slice(1, b.length - 1);
    } else if (b.match(/true/i)) {
        b = true;
    } else if (b.match(/false/i)) {
        b = false;
    }else if (b.match(/.*(.*)$/ig)) {
     b = 'EXEC(' + b + ')';  
    } else {
        b = parseInt(b, 10);
    }
    return b;
}

exports.run = function(code) {
    var alles = {};
    build(alles, code);
    console.log(alles);
    return 'Oh, hai';
};

