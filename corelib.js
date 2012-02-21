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
    array: function() {
        return Array.prototype.slice.call(arguments);
    },
    '>': function(a, b) {
        console.log(a, b)
        var a = parseInt(a, 10),
        b = parseInt(b, 10);
        return a > b;
    },
    '<': function(a, b) {
        var a = parseInt(a, 10),
        b = parseInt(b, 10);
        return a > b;
    },
    '==': function(a, b) {
        return a === b;
    },
    'if': function(con, a, b) {
        if (con) return a;
        else return b;
    }
};

if (typeof module !== 'undefined') {
    Object.keys(corelib).forEach(function(key) {
        exports[key] = corelib[key];
    });
}

