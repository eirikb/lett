var assert = require('assert')
var lett = require('../lett.js');

describe('simple assignment', function() {
    it('should return 42 when its the last statement', function() {
        assert.equal(42, lett('42'));
        assert.equal(42, lett('1 42'));
        assert.equal(42, lett('1 2 3 42'));
        assert.equal(42, lett('a 2 a 42'));
    });

    it('should set var a to 3', function() {
        assert.equal(3, lett('a 3 a'));
        assert.equal(3, lett('a 7 a 3 a'));
    });
});

describe('objects', function(){
    it('should set a to 7', function() {
        assert.equal(7, lett('{a 7}').a);
        assert.equal(7, lett('test {a 7} test').a);
        assert.equal(7, lett('{test {a 7}}').test.a);
        assert.notEqual(7, lett('{test {a 7}}').a);
    });

    it('should support deeper objects', function() {
        assert.equal(42, lett('{a { b { c 42 }}').a.b.c);
        assert.notEqual(42, lett('{a { b { c 42 }}').c);
    });

    it('should support objects of any type', function() {
        var res = lett('{a { b "test" c 7}}');
        assert.equal('test', res.a.b);
        assert.equal(7, res.a.c);
    });
});

describe('arrays', function() {
    it('should support assignment og arrays', function() {
        assert.equal(2, lett('[1 2 3]')[1]);
    });

    it('should support arrays of any type', function() {
        var res = lett('[1 2 {a 42} {a {b "test"}} 7');
        assert.equal(2, res[1]);
        assert.equal(42, res[2].a);
        assert.equal("test", res[3].a.b);
        assert.equal(7, res[res.length - 1]);
    });
});
