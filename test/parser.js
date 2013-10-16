var assert = require('assert');
var parser = require('../src/parser.js');

describe('parser', function() {
  it('should not halt on errorous strings', function(done) {
    // Not sure if this is correct syntax
    this.timeout(500);
    parser.parse('"');
    done();
  });
});
