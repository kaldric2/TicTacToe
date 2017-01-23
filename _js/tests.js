var highPass = function highPass(number, cutoff) {
    if (number >= cutoff) {
      return true;
    } else {
      return false;
    }
  },

  lowPass = function lowPass(number, cutoff) {
    if (number >= cutoff) {
      return true;
    } else {
      return false;
    }
  };

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.module('Filter Examples');

QUnit.test('highPass', function (assert) {
  assert.ok(!highPass(2, 5), 'Lower values should not pass.');
  assert.ok(highPass(8, 5), 'Higher values should pass.');
});

QUnit.test('lowPass', function (assert) {
  assert.ok(lowPass(2, 5), 'Lower values should pass.'); // Fails
  assert.ok(!lowPass(8, 5),
    'Higher values should not pass.'); // Fails
});
