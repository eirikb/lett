function letteval(node, obj) {
    if (node.name) {
        var a = handle[node.name](node, obj);
        last = a;
        return a;
    }
    return node;
}

// Assign variables by % 2 factor, return [{name:...},{name:...}]
function assignVars(vars, obj) {
    if (vars.length === 1) return letteval(vars[0], obj);

    var varname
    var objs = [];
    var j = 0;

    function push(v) {
        v = letteval(v, obj);
        v.varname = varname;
        objs.push(v);
    }

    vars.forEach(function(v, i) {
        if (j % 2 === 0) {
            if (!v.name && i < vars.length - 1) {
                varname = v.val;
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
        var vars = assignVars(node.children);
        vars.forEach(function(c) {
            assignVar(c);
        });
        return obj;
    },

    call: function(node, obj) {
        var fn, args, parent;
        fn = last;

        args = node.map(function(n) {
            return letteval(n, obj);
        });
        if (fn) fn = fn.apply(parent, args);
        return fn;
    },

    fn: function(node, obj) {
        var vars = [],
        j = 0,
        body,
        ret;

        vars = node.slice(0, - 1);
        //body = node[node.length - 1];
        body = node.slice( - 1);

        ret = function() {
            var a = arguments;
            vars.forEach(function(v, i) {
                obj[v] = a[i];
            });
            return letteval(body, obj);
        };
        node.ret = ret;
        return ret;
    },

    str: function(node, obj) {
        return node.val;
    }
};

exports.build = function(tree) {
    var vars = assignVars(tree, {});
    return vars[vars.length - 1];
};
