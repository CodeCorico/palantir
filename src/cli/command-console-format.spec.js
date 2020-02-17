/* eslint-disable no-console */
const {
  date, log, logDate, logSuccess, logWarning, logError, banner,
} = require('./command-console-format');

describe('Command console format', () => {
  const DATE_TO_USE = new Date('2020-02-17 01:02:03');
  const DateOrig = Date;
  const logOrig = console.log;
  let lastLog = '';

  beforeEach(() => {
    global.Date = jest.fn(() => DATE_TO_USE);
    global.Date.UTC = DateOrig.UTC;
    global.Date.parse = DateOrig.parse;
    global.Date.now = DateOrig.now;
    lastLog = '';

    console.log = (...args) => {
      lastLog += `\n${args.join(' ')}`;
    };
  });

  afterEach(() => {
    global.Date = DateOrig;
    lastLog = '';
    console.log = logOrig;
  });

  it('should have a formatted date', () => {
    expect(date()).toBe('[01:02:03]');
  });

  it('should log', () => {
    log('hello world');
    expect(lastLog).toBe('\nhello world');
    log('hello world2');
    expect(lastLog).toBe('\nhello world\nhello world2');
    log('hello world3', 'hello world4');
    expect(lastLog).toBe('\nhello world\nhello world2\nhello world3 hello world4');
  });

  it('should log with a date', () => {
    logDate('hello world');
    expect(lastLog).toBe('\n[01:02:03] hello world');
  });

  it('should log a success message', () => {
    logSuccess('hello world');
    expect(lastLog).toBe('\n[01:02:03] hello world');
  });

  it('should log a warning message', () => {
    logWarning('hello world');
    expect(lastLog).toBe('\n[01:02:03] hello world');
  });

  it('should log an error message', () => {
    logError('hello world');
    expect(lastLog).toBe('\n[01:02:03] hello world');
  });

  it('should log a banner', () => {
    banner();
    expect(lastLog).toEqual(expect.stringContaining('Palantir'));
  });

  it('should log a banner with a title', () => {
    banner('my title');
    expect(lastLog).toEqual(expect.stringContaining('my title'));
  });
});
