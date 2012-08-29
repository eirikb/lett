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
    if (obj[node]) node = obj[node];
    if ((''+node).match(/^true$/i)) node = true;
    else if ((''+node).match(/^false$/)) node = false;
    return node;
}

// Assign variables by % 2 factor, return [{name:...},{name:...}]
function assignVars(vars, obj) {
    if (vars.length === 1) return [letteval(vars[0], obj)];

    var varname;
    var objs = [];
    var j = 0;

    function push(v) {
        v = letteval(v, obj);
        v.varname = varname;
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
        if (!fn) fn = corelib[node.call];
        if (!fn) return null;

        var args = node.map(function(n) {
            return letteval(n, obj);
        });
        var f = function(o) {
                args = args.map(function(a) {
                    if (o && o[a]) a = o[a];
                    return a.torun ? a() : a;
                });
                return fn.apply(null, args);
            };
        // torun is a hack to force building of the whole tree
        f.torun = true;
        return f;
    },

    fn: function(node, obj) {
        var vars = node.slice(0, -1);
        var body = node[node.length - 1];
        body = letteval(body, obj);
        var last = body[body.length - 1];

        return function() {
            var a = arguments;
            vars.forEach(function(v, i) {
                obj[v] = a[i];
            });
            if (obj[last]) last = obj[last];
            if (last.torun) last = last(obj);
            return last;
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
        return (node[1]) ? letteval(node[1], val) : val[node[0]];
    },

    fnbody: function(node, obj) {
        return assignVars(node, obj);
    }
};
