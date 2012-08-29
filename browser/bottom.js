return function(code, obj) {
    var tree = exports.parse(code);
    var build = exports.build(tree, obj);

    if (build.torun) build = build();
    return build;
};
})();
