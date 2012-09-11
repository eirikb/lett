exports.parse = function(code) {
    code = code.replace(/\n|\r/g, ' ');
    var tree = buildTree(code).filter(function(branch) {
        return branch;
    });
    tree = remapCall(tree);
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

// Call bodies are by default positions after a call
function remapCall(tree) {
    var i;
    for (i = 0; i < tree.length; i++) {
        if (Array.isArray(tree[i])) tree[i] = remapCall(tree[i]);
        if (tree[i].name === 'call' && i > 0) {
            tree[i].call = tree[i - 1];
            tree.splice(i - 1, 1);
        }
    }
    return tree;
}

