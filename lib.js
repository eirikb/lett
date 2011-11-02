//
//  Here be global library function hacks
//
var lettlib = {
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
    }

};

Object.keys(lettlib).forEach(function(key) {
    exports[key] = lettlib[key];
});

