const expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage', () => {
  it ('should generate correct message', (done) => {
    var from = 'John';
    var text = 'Hi there!';
    var result = generateMessage(from, text);

    expect(result).toBeA('object');
    expect(result).toInclude({from, text});
    expect(result.createdAt).toBeA('number');
    done();
  });
});
