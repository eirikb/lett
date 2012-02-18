if (typeof require !== 'undefined') corelib = require('./corelib.js');

var lett = (function() {
    var fn, code, tmp, wraps = {
        '{': '}',
        '(': ')'
    },
    types = {
        '{': 'obj',
        '(': 'fn',
        '"': 'str',
        "'": 'str'
    };

    function buildTree(t, level) {
        var type, p, index, end, l, part = '',
        current = [],
        chain = [],
        addPart = function(type) {
            var tmp;
            part = part.slice(0, part.length - 1).trim();
            if (part.length > 0) {
                part = {
                    part: part,
                    type: types[type]
                };
                if (part.type === 'fn' && part.part) part.type = 'call';
                current.push(part);
                tmp = part;
                part = '';
                return tmp;
            }
        };
        level = level || 0;

        while ((index = code.search(/\{|\}|'|"|\(|\)| /)) >= 0) {
            part += code.slice(0, index + 1);
            l = code.charAt(index);
            code = code.slice(index + 1);

            if (!end) p = addPart(l);

            if (l.match(/'|"/)) {
                if (end && end === l) {
                    addPart(l);
                    end = false;
                } else if (!end) {
                    end = l;
                }
            } else if (l.match(/\{|\(/)) {
                if (p && p.type === 'call') {
                    p.args = buildTree(wraps[l], level + 1);
                    if (p.part.match(/^\./) && chain[level]) {
                        chain[level].chain = p;
                        current.splice(current.indexOf(p));
                    }
                    chain[level] = p;
                } else {
                    current.push({
                        children: buildTree(wraps[l], level + 1),
                        type: types[l]
                    });
                }
            } else if (l === t) {
                return current;
            }
        }
        return current;
    }

    function removeComments() {
        code = code.replace(/\/\/.*\n/g, '');
    }

    // Currently only building parse tree
    function build(c) {
        code = c;
        removeComments();
        return buildTree();
    }

    return {
        build: build,
        buildTree: build
    };
})();

if (typeof module !== 'undefined') module.exports = lett.build;

