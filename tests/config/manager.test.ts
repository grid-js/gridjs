import Manager from "../../src/config/manager";

describe( 'ConfigManager class', () => {
  let configManager = null;

  beforeEach(() => {
    configManager = new Manager();
    configManager.set('key1', 1);
    configManager.set('key2', 2);
  });

  it('should return the correct length', () => {
    expect(Array.from(configManager.keys()).length).toBe(2);
  });

  it('should return the correct keys', () => {
    expect(Array.from(configManager.keys())).toStrictEqual(['key1', 'key2']);
  });

  it('should return the correct values', () => {
    expect(Array.from(configManager.values())).toStrictEqual([1, 2]);
  });

  it('should return the value after calling get', () => {
    expect(configManager.get('key1')).toBe(1);
  });

  it('should set the vale', () => {
    configManager.set('key1', 100);
    expect(configManager.get('key1')).toBe(100);
  });
});
