var assert = require('assert');
var lett = require('../lett.js');

describe('corelib', function() {
    describe('conditionals', function() {
        it('should be evaluated correctly', function() {
            assert.equal(42, lett('if(true 42)'));
            assert.equal(42, lett('if(false 7 42)'));
        });

        it('should not run all calls inside the conditional', function() {
            assert.equal(42, lett('t <,t()> if(true 42 t())'));
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

        it('should support getters', function() {
            var o = {
                a: {
                    b: 42
                }
            };
            assert.equal(42, lett('g(a "b")', o));
        });

        it.skip('should support floats', function() {
            assert.equal(42.1337, lett('.(42 1337)'));
        });
    });
});
