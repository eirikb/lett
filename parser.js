exports.parse = function(code) {
    code = code.replace(/\n|\r/g, ' ');
    var tree = buildTree(code).filter(function(branch) {
        return branch;
    });
    return tree;
};

var regexTypes = {
    call: /\(/,
    divide: / /,
    fnbody: /,/,
    fn: /</,
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
    var part = '';
    var root = [];
    var current = root;

    var type;
    while (type = searchType(code)) {
        if (type.index === 0) {
            var tmp = [];
            tmp.name = type.name;
            tmp.parent = current;
            if (type.name === 'str') {
                type.index = code.indexOf(code.charAt(type.index), 1);
                if (type.index < 0) break;
                tmp.push(code.slice(1, type.index));
                current.push(tmp);
            } else if (type.name === 'end') {
                current = current.parent;
                if (current.name === 'fn') current = current.parent;
            } else if (type.name === 'call' || type.name === 'chain') {
                var i = current.length - 1;
                tmp[type.name] = current[i];
                current = current[i] = tmp;
            } else {
                current.push(tmp);
                current = tmp;
            }
            type.index++;
        } else {
            current.push(code.slice(0, type.index));
        }

        code = code.slice(type.index).trim();
    }
    current.push(code.trim());
    return root;
}
