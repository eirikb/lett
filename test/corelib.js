var assert = require('assert');
var lett = require('../lett.js');

describe('corelib', function() {
    describe('if statements', function() {
        it('should be evaluated correctly', function() {
            assert.equal(42, lett('if(true 42)'));
            assert.equal(42, lett('if(false 7 42)'));
        });
    });

    describe('corelib properties', function() {
        it('should handle addition', function() {
            assert.equal(42, lett('+(10 10 20 2'));
        });

        it('should handle subtraction', function() {
            assert.equal(0, lett('-(42 10 10 20 2'));
        });

        it('should handle dividing', function() {
            assert.equal(42, lett('/(84 2)'));
        });

        it('should handle multiplication', function() {
            assert.equal(42, lett('*(21 2)'));
        });

        it('should handle string concationation', function() {
            assert.equal('It is known, Khaleesi', lett('str("It is known" "," " Khaleesi")'));
        });

        it('should handle greater than', function() {
            assert.equal(true, lett('gt(42 7)'));
        });

        it('should handle lesser than', function() {
            assert.equal(true, lett('lt(42 100)'));
        });

        it('should handle equality', function() {
            assert.equal(true, lett('eq(42 42)'));
        });
    });
});
