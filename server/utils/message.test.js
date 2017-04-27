const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it ('should generate correct message', (done) => {
    var from = 'John';
    var text = 'Hi there!';
    var message = generateMessage(from, text);

    expect(message).toInclude({from, text});
    expect(message.createdAt).toBeA('number');
    done();
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', (done) => {
    var from = 'Jen';
    var latitude = '1234567890';
    var longitude = '-987654321';
    var url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    var message = generateLocationMessage(from, latitude, longitude);

    expect(message).toInclude({from, url});
    expect(message.createdAt).toBeA('number');
    done();
  });
});
