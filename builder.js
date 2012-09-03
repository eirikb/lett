var corelib = require('./corelib.js');

exports.build = function(tree, obj) {
    if (!obj) obj = {};
    var vars = assignVars(tree, obj);
    return vars[vars.length - 1];
};

function letteval(node, obj) {
    if (node.name) {
        var a = handle[node.name](node, obj);
        return a;
    }
    if (obj[node]) return obj[node];
    if (('' + node).match(/^true$/i)) return true;
    if (('' + node).match(/^false$/)) return false;
    if (corelib[node]) return corelib[node];

    var n = parseInt(node, 10);
    if (!isNaN(n)) return n;
    return null;
}

// Assign variables by % 2 factor, return [{name:...},{name:...}]
function assignVars(vars, obj) {
    if (vars.length === 1) return [letteval(vars[0], obj)];

    var varname;
    var objs = [];
    var j = 0;

    function push(v) {
        v = letteval(v, obj);
        objs.push(v);
        obj[varname] = v;
        varname = null;
    }

    vars.forEach(function(v, i) {
        if (j % 2 === 0) {
            if (!v.name && i < vars.length - 1) {
                varname = v;
                j++;
            } else {
                push(v);
            }
        } else {
            push(v);
            j++;
        }
    });
    return objs;
}

var handle = {
    obj: function(node, obj) {
        var o = {};
        var vars = assignVars(node, o);
        return o;
    },

    call: function(node, obj) {
        var fn = obj[node.call];
        if (!fn) fn = letteval(node.call, obj);

        var args = node.map(function(n) {
            return letteval(n, obj);
        });
        var f = function(o) {
                args = args.map(function(a) {
                    if (o && o[a]) a = o[a];
                    return a;
                });
                return fn.apply(null, args);
            };
        return f();
    },

    fn: function(node, obj) {
        var vars = node.slice(0, -1);
        var body = node[node.length - 1];

        return function() {
            var a = arguments;
            vars.forEach(function(v, i) {
                obj[v] = a[i];
            });

            body = letteval(body, obj);
            return body[body.length - 1];
        };
    },

    str: function(node, obj) {
        return node[0];
    },

    array: function(node, obj) {
        return node.map(function(n) {
            return letteval(n, obj);
        });
    },

    chain: function(node, obj) {
        var name = node.parent[0];
        var val = obj[name];
        if (typeof val === 'function') val = val();
        return (node[1]) ? letteval(node[1], val) : val[node[0]];
    },

    fnbody: function(node, obj) {
        return assignVars(node, obj);
    }
};
