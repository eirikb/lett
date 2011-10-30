var alles = {};

exports.run = function(code) {
    code.split('{').forEach(function(p) {
        p.split('}').forEach(function(p) {
            p.split(',').forEach(function(p) {
                p = p.trim();
                if ( !! p) {
                    var s = p.split(':'),
                    a = s[0];
                    b = s[1].trim();

                    if (b.match(/^('|").*('|")$/)) {
                        b = b.slice(1, b.length - 1);
                    } else if (b.match(/true/i)) {
                        b = true;
                    } else if (b.match(/false/i)) {
                        b = false;
                    } else {
                        b = parseInt(b, 10);
                    }
                    alles[a] = b;
                }
            });
        });
    });

    console.log(alles);

    return 'Oh, hai';
};

