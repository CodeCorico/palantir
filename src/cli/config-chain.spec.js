const config = require('./config-chain');

describe('Chain', () => {
  it('expect true to be true', () => {
    expect(config).not.toBeUndefined();
  });
});
