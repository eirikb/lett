var assert = require('assert');
var lett = require('../lett.js');

describe('lett', function() {
    it('should support simple fibonacci', function() {
        var src = 'fib <n, if(lt(n 2) n +(fib(-(n 1)) fib(-(n 2))))> fib(1)'

        //  TODO: Make work! :)
        //  assert.equal(34, lett(src));
    });
});
