/**
 * Helper function for more expressive conditions.
 *
 * Can be used anywhere a arithmetic is expected.
 * calculate two values with an operator.
 *
 * Usage:
 *   ```
 *   {{arithmetic v1 '/' v2}}
 *   {{arithmetic v1 '+' v2}}
 *   {{arithmetic v1 '/' v2}}
 *   {{arithmetic v1 '*' v2}}
 *   {{arithmetic v1 'max' v2}}
 *   {{arithmetic v1 'min' v2}}
 *   {{arithmetic v1 'fixed' v2}}
 *   ```
 *
 * @param v1
 * @param operator
 * @param v2
 * @return {*}
 */
module.exports = function (v1, operator, v2) {
  switch (operator) {
    case '-':
      return v1 - v2;
    case '+':
      return v1 + v2;
    case '/':
      return v1 / v2;
    case '*':
      return v1 * v2;
    case 'max':
      return Math.max(v1, v2);
    case 'min':
      return Math.min(v1, v2);
    case 'fixed':
      return v1.toFixed(v2);
    default:
      throw new Error('No valid operator ' + operator);
  }
};
