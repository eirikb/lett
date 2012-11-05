//
//  Here be global library function hacks
//
var corelib = {
    '+': function() {
        var i, n = parseInt(arguments[0], 10);
        for (i = 1; i < arguments.length; i++) {
            n += parseInt(arguments[i], 10);
        }
        return n;
    },
    '-': function() {
        var i, n = parseInt(arguments[0], 10);
        for (i = 1; i < arguments.length; i++) {
            n -= parseInt(arguments[i], 10);
        }
        return n;
    },
    '/': function() {
        var i, n = parseInt(arguments[0], 10);
        for (i = 1; i < arguments.length; i++) {
            n /= parseInt(arguments[i], 10);
        }
        return n;
    },
    '*': function() {
        var i, n = parseInt(arguments[0], 10);
        for (i = 1; i < arguments.length; i++) {
            n *= parseInt(arguments[i], 10);
        }
        return n;
    },
    str: function() {
        var i, s = '';
        for (i = 0; i < arguments.length; i++) {
            s += arguments[i];
        }
        return s;
    },
    gt: function(a, b) {
        a = parseInt(a, 10);
        b = parseInt(b, 10);
        return a > b;
    },
    lt: function(a, b) {
        a = parseInt(a, 10);
        b = parseInt(b, 10);
        return a < b;
    },
    eq: function(a, b) {
        return a === b;
    },
    if: function(con, a, b) {
        if (typeof con === 'function') con = con();
        var ret = b;
        if (con) ret = a;
        if (typeof ret === 'function') return ret();
        return ret;
    },
    g: function(o, n) {
        return o[n];
    },
    for: function(from, to, cb) {
        if (arguments.length === 2) {
            cb = to;
            to = from;
            from = 0;
        }
        var ret = [];
        for (var i = from; i < to; i++) {
            ret.push(cb(i));
        }
        return ret;
    },
    'f': function(a, b) {
        return parseFloat(a + '.' + b);
    }
};

Object.keys(corelib).forEach(function(key) {
    exports[key] = corelib[key];
});

exports.if.crap = true;

