var parser = (function() {
    // String splitting on ', ", (, ), {, } and space. 
    function split(code) {
        var index, l, end = false,
        part = '',
        parts = [];
        while ((index = code.search(/[\{\}'"\(\) ]/)) >= 0) {
            part += code.slice(0, index + 1);
            l = code.charAt(index);
            code = code.slice(index + 1);

            if (l.match(/'|"/)) end = end === l ? false: l;
            if (!end) {
                if (part.match(/\)$|\}$/)) {
                    parts.push(part.slice(0, - 1).trim());
                    part = part.slice( - 1);
                }
                parts.push(part.trim());
                part = '';
            }
        }
        parts.push(code.trim());
        return parts;
    }

    // Building array based tree structure of splitted string
    function buildTree(parts) {
        var tree = [],
        level = 0,
        current = tree,
        parent = [];

        parts.forEach(function(part) {
            current.push(part);
            if (part.match(/\{|\(/)) {
                parent[level] = current;
                current = [];
                parent[level].push(current);
                level++;
            } else if (part.match(/\}|\)/)) {
                level--;
                current = parent[level];
            }
        });
        return tree;
    }

    // Build proper node based tree from array based tree
    // Includes fugly hack for calling anon functions
    function buildStructure(tree) {
        var node, prev, types = {
            '(': 'fn',
            '{': 'obj',
            '"': 'str',
            "'": 'str'
        };
        return tree.map(function(branch) {
            var hack, type = types[('' + branch).charAt(0)];

            if (Array.isArray(branch)) {
                node.children = buildStructure(branch);
            } else {
                // Anon hack
                hack = node && node.children;
                hack = hack && hack[hack.length - 1];
                if (type === 'fn' && hack && ('' + hack.val).match(/\)/)) {
                    type = 'call';
                    branch = node;
                }
                node = {};
                if (('' + branch).length > 1 && ('' + branch).match(/\($/)) {
                    type = 'call';
                    branch = branch.slice(0, - 1);
                    if (branch.match(/^\./)) {
                        prev.chain = node;
                    }
                }
                if (type) node.type = type;
                else node.val = branch;
                if (type === 'call') node.val = branch;
                else if (type === 'str') node.val = branch.slice(1, - 1);
                if (prev && prev.chain) {
                    prev = node;
                    return;
                }
                prev = node;
                return node;
            }
        }).filter(function(branch) {
            return branch && ('' + branch.val).length > 0;
        });
    }

    // Clean away trailing ) and } from tree (used for anon hack)
    function cleanTree(tree) {
        if (Array.isArray(tree)) return tree.map(cleanTree);
        if (tree.children) tree.children = tree.children.slice(0, - 1).map(cleanTree);
        if (tree.chain) tree.chain = cleanTree(tree.chain);
        return tree;
    }

    // This is just temporary, and very ugly!
    function removeComments(code) {
        return code.replace(/\/\/.*\n/g, '');
    }

    function parse(code) {
        var tree, parts;
        code = removeComments(code);
        parts = split(code);
        tree = buildTree(parts);
        tree = buildStructure(tree);
        tree = cleanTree(tree);
        return tree;
    }

    return {
        parse: parse
    };
})();

if (typeof module !== 'undefined') module.exports = parser.parse;

