function buildTree(t) {
    var index, end, l, part = '',
    current = [],
    wraps = {
        '{': '}',
        '(': ')'
    },
    addPart = function(type) {
        part = part.slice(0, part.length - 1).trim();
        if (part.length > 0) current.push({
            part: part,
            type: type
        });
        part = '';
    };

    while ((index = code.search(/{|}|'|"|\(|\)| /)) >= 0) {
        part += code.slice(0, index + 1);
        l = code.charAt(index);
        code = code.slice(index + 1);

        if (!end) addPart(l);

        if (l.match(/'|"/)) {
            if (end && end === l) {
                addPart(l);
                end = false;
            } else if (!end) {
                end = l;
            }
        } else if (l.match(/{|\(/)) {
            current.push(buildTree(wraps[l]));
        } else if (l === t) {
            return current;
        }
    }
    return current;
}

var code;

module.exports = function(c) {
    code = c;

    var tree = buildTree();
    print(tree);
    //return tree;
};

function print(a, l) {
    if (!l) l = 0;
    var s = new Array(l + 1).join(' ');
    a.forEach(function(b) {
        if (Array.isArray(b)) {
            print(b, l + 2);
        } else {
            console.log(s, b);
        }
    });
}

