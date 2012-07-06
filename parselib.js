var lettlib;
if (!lettlib) lettlib = {};

lettlib.parse = (function() {

    var regexTypes = {
        call: /\(/,
        divide: / /,
        fnbody: /,/,
        fn: /\</,
        obj: /\{/,
        array: /\[/,
        chain: /\./,
        str: /['"]/,
        end: /[\>\}\]\)]/
    };

    function searchType(str) {
        return Object.keys(regexTypes).map(function(name) {
            return {
                index: str.search(regexTypes[name]),
                name: name
            };
        }).filter(function(type) {
            return type.index >= 0;
        }).sort(function(a, b) {
            return a.index > b.index;
        })[0];
    }

    // String splitting on . < > { } [ ] asdf( ) space. 
    // Everything inside ' and " is not split.
    function buildTree(code) {
        var chain, type, tmp, part = '',
        root = [],
        current = root;

        while (type = searchType(code)) {
            if (type.index === 0) {
                tmp = [];
                tmp.name = type.name;
                tmp.parent = current;
                if (type.name === 'str') {
                    type.index = code.indexOf(code.charAt(type.index), 1);
                    tmp.push(code.slice(1, type.index));
                    current.push(tmp);
                } else if (type.name === 'end') {
                    current = current.parent;
                    if (current.name === 'fn') current = current.parent;
                } else {
                    current.push(tmp);
                    current = tmp;
                }
                type.index++;
            } else {
                current.push(code.slice(0, type.index));
            }

            if (current.name === 'chain' && ! chain) {
                chain = current;
            } else if (chain && type.name !== 'chain') {
                current = chain.parent;
                chain = false;
            }

            code = code.slice(type.index).trim();
        }
        current.push(code.trim());
        return root;
    }

    function parse(code) {
        var tree, parts;
        tree = buildTree(code).filter(function(branch) {
            return branch;
        });
        return tree;
    }

    return parse;
})();

if (typeof module !== 'undefined') module.exports = lettlib.parse;

