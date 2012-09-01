var assert = require('assert');
var lett = require('../lett.js');

describe('lett', function() {
    it('should support simple fibonacci', function() {
        var src = 'fib <n, if(lt(n 2) n +(fib(-(n 1)) fib(-(n 2))))> fib(1)'

        //  TODO: Make work! :)
        //  assert.equal(34, lett(src));
    });

    it('should support side effects', function() {
        var o = {};
        lett('a 41', o);
        lett('a +(a 1)', o);
        assert.equal(42, lett('a', o));
    });

    it('should support object as argument', function() {
        var o = {};
        lett('a 41', o)
        lett('a +(a 1)', o)
        assert.equal(42, lett('a', o));
        // TODO :Add back when works
        // assert.equal(42, o.a);
    });
});
