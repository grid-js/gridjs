import Config from "../src/config";

describe( 'Config', () => {
  let config = null;

  beforeEach(() => {
    config = new Config();
    config.set('key1', 1);
    config.set('key2', 2);
  });

  it('should return the correct length', () => {
    expect(Array.from(config.keys()).length).toBe(2);
  });

  it('should return the correct keys', () => {
    expect(Array.from(config.keys())).toStrictEqual(['key1', 'key2']);
  });

  it('should return the correct values', () => {
    expect(Array.from(config.values())).toStrictEqual([1, 2]);
  });

  it('should return the value after calling get', () => {
    expect(config.get('key1')).toBe(1);
  });

  it('should set the vale', () => {
    config.set('key1', 100);
    expect(config.get('key1')).toBe(100);
  });
});
