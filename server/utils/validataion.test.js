const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string value', () => {
    expect(isRealString(123)).toBe(false);
  });

  it('should reject string with only space', () => {
    expect(isRealString('   ')).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    expect(isRealString('  Hello World  ')).toBe(true);
  });
});
