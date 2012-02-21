if (typeof require !== 'undefined') corelib = require('./corelib.js');
if (typeof require !== 'undefined') parser = require('./parser.js');

var lett = (function() {
    var handle = {
        obj: function(node, obj) {
            var vars = assignVars(node.children);
            vars.forEach(function(c) {
                assignVar(c, obj);
            });
            return obj;
        },

        call: function(node, obj) {
            var fn, args, parent = node.val.split('.').slice(0, -1).join('');
            parent = getReference(parent, obj);

            args = node.children.map(function(n) {
                return letteval(n, obj);
            });
            if (node.val.match(/^\./)) {
                node.val = node.val.slice(1);
                parent = obj;
            }
            fn = getReference(node.val, obj);
            if (fn) fn = fn.apply(parent, args);
            if (fn && node.chain) return handle.call(node.chain, fn);
            return fn;
        },

        fn: function(node, obj) {
            var vars = [], j = 0, fnbody;
            node.children.every(function(c, i) {
                if (!c.type) {
                    vars.push(c.val);
                    j++;
                    return true;
                }
            });
            fnbody = node.children.slice(j);
            return function() {
                var a = arguments;
                vars.forEach(function(v, i) {
                    obj[v] = a[i];
                });
                return functionBody(fnbody, obj);
            };
        },

        str: function(node) {
            return node.val;
        }
    };
    function getReference(name, obj) {
        var r = obj;
        name.split(/\./).forEach(function(name) {
            parent = r;
            r = r && r[name];
            if (typeof r === 'undefined') r = this[name];
            if (typeof r === 'undefined') r = corelib[name];
        });
        return r;
    }

    function assignVar(v, obj) {
        var c, r = obj;
        if (v.length === 2) {
            c = v[0].split(/\./);
            c.slice(0, - 1).forEach(function(c) {
                if (!r[c]) r[c] = r = {};
            });
            r[c.slice( - 1)] = letteval(v[1], {});
            return obj;
        } else {
            return letteval(v, obj);
        }
    }

    function functionBody(vars, obj) {
        vars = assignVars(vars);
        vars.slice(0, - 1).forEach(function(v) {
            assignVar(v, obj);
        });
        return assignVar(vars.slice( - 1)[0], obj);
    }

    // Assign variables by % 2 factor
    function assignVars(vars) {
        var name, obj = [],
        j = 0;
        vars.forEach(function(v, i) {
            if (j % 2 === 0) {
                if (!v.type && i < vars.length - 1) {
                    name = v.val;
                    j++;
                } else {
                    obj.push(v);
                }
            } else {
                obj.push([name, v]);
                j++;
            }
        });
        return obj;
    }

    // Evaluate the code
    function letteval(node, obj) {
        var h;
        if (node) {
            h = parseInt(node.val, 10);
            if (!isNaN(h)) return h;
            h = handle[node.type];
            if (h) return h(node, obj);
            h = getReference(node.val, obj);
            if (typeof h !== 'undefined') return h;
            return null;
        }
    }

    function build(code) {
        var tree = parser.parse(code);
        tree = functionBody(tree, {});
        console.log('Result', tree);
        return tree;
    }

    return {
        build: build
    };
})();

if (typeof module !== 'undefined') module.exports = lett.build;

