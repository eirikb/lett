var assert = require('assert');
var lett = require('../src/lett.js');

describe('lett', function() {
  describe('assignment', function() {
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

    // They are litterals! I promise!
    it('should set true and false to ... true and false', function() {
      assert.equal(true, lett('true'));
      assert.equal(false, lett('false'));
    });

    it('should support incrementing', function() {
      assert.equal(42, lett('kaffe 41 kaffe +(kaffe 1) kaffe'));
    });

    it('should not disturbe the sent in object in special cases', function() {
      var a = {
        hello: 'world'
      };
      lett('"hack" split()', a);
      assert.equal('world', a.hello);
    });
  });

  describe('objects', function() {
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
      var res = lett('[1 2 {a 42} {a {b "test"}} 7]');
      assert.equal(2, res[1]);
      assert.equal(42, res[2].a);
      assert.equal("test", res[3].a.b);
      assert.equal(7, res[res.length - 1]);
    });

    it('should support array prototypes', function() {
      assert.equal(3, lett('[1 1 1].map(<,>)').length);
    });
  });

  describe('calls', function() {
    it('should return 42 when adding 21 with 21', function() {
      assert.equal(42, lett('+(21 21)'));
    });

    it('should support n amount of arguments', function() {
      assert.equal(42, lett('+(10 10 10 12)'));
    });

    it('should support nesting of calls', function() {
      assert.equal(42, lett('+(10 10 +(10 12))'));
      assert.equal(42, lett('+(10 10 +(10 -(22 10)))'));
    });

    it('should support any types as arguments', function() {
      assert.equal(42, lett('a 10 b 20 c 10 +(a b c 2)'));
    });

    it('should handle calls on calls on calls', function() {
      var o = {
        a: function() {
          return function() {
            return function() {
              return 42;
            }
          }
        }
      };
      assert.equal(42, lett('a()()()', o));
    });
  });

  describe('chaining', function() {
    it('should support chaining of objects', function() {
      assert.equal(42, lett('a { b 42 } a.b'));
      assert.equal(42, lett('a { b { c { d 42 }}} a.b.c.d'));
    });

    it('should support directly on objects', function() {
      assert.equal(42, lett('a { b { c { d 42 }}}.b.c.d'));
    });

    it('should support chaining of any return', function() {
      var o = {
        a: function() {
          return {
            b: 42
          }
        }
      };
      assert.equal(42, lett('a().b', o));
    });

    it('should not screw up the original object', function() {
      var o = {
        a: {
          b: 42
        }
      };
      assert.equal(42, lett('a.b', o));
      assert.equal(42, lett('a.b', o));
    });
  });

  describe('functions', function() {
    it('should create a function returning 42', function() {
      assert.equal(42, lett('<,42>')());
    });

    it('should accept arguments', function() {
      assert.equal(42, lett('<a,a>')(42));
    });

    it('should be able to execute directly after declaration', function() {
      assert.equal(42, lett('<a b, +(a b)>(21 21)'));
      assert.equal(42, lett('<,42>()'));
    });

    it('should handle larger bodies', function() {
      assert.equal(42, lett('<,a 42 a>')());
      assert.equal(42, lett('<a,a>')(42));
      assert.equal(42, lett('test <a,a> test(42)'));
    });

    it('should support nesting', function() {
      assert.equal(42, lett('f1 <,f2 <,42> f2()> f1()'));
      assert.equal(42, lett('<,<,42>()>()'));
    });

    it('should support recursiveness', function() {
      assert.equal(42, lett('<n,if(lt(n 100) 42 7)>(4)'));
    });

    it('should have an internal array called "args" for arguments', function() {
      assert.equal(3, lett('<,args>(1 1 1)').length);
      assert.equal(true, Array.isArray(lett('<,args>()')));
    });

    it('should support built in array functions correctly', function() {
      var res = lett('[1 2 3].map(<i,+(i 1)>)');
      assert.equal(2, res[0]);
      assert.equal(3, res[1]);
      assert.equal(4, res[2]);
    });
  });

  describe('object paramters', function() {
    it('can be sent into <,> as arguments', function() {
      var a = {
        b: 42
      };
      assert.equal(42, lett('b', a));
    });
  });

  describe('object assignment', function() {
    it('should not mess up numbers', function() {
      var o = {};
      lett('a 42', o);
      assert.equal(42, o.a);
    });

    it('should not mess up strings', function() {
      var o = {};
      lett('a "42"', o);
      assert.equal('42', o.a);
    });

    it('should not mess up null (unasigned)', function() {
      var o = {};
      lett('a', o);
      assert.equal(null, o.a);
    });

    it('should not mess up calls', function() {
      var o = {};
      lett('a +(41 1)', o);
      assert.equal(42, o.a);
      lett('b [+(41 1)]', o);
      assert.equal(42, o.a);
      assert.equal(42, o.b);
    });
  });

  it('should support recursion', function() {
    var src = 'test <n, if(lt(n 10) test(+(n 1)) n)> test(1)';
    assert.equal(10, lett(src));
  });

  //  TODO: Make work! :)
  it.skip('should support simple fibonacci', function() {
    var src = 'fib <n, if(lt(n 2) n +(fib(-(n 1)) fib(-(n 2))))> fib(7)'
    assert.equal(3, lett(src));
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
    assert.equal(42, o.a);
  });

  it.skip('should support arrays in arrays', function() {
    var res = lett("[[1 2].map(<i,i>) 1]");
    assert.equal([
      [1, 2], 1
    ], res);
  });

  it.skip('should print a b', function() {
    var res = lett("x ['a'].join('') str(x 'b')");
    assert.equal('a b', res);
  });

  it.skip('should print a b', function() {
    var res = lett("x ['a'].join('') str(x 'b')");
    assert.equal('a b', res);
  });
});
