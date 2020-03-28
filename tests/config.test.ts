import Config from "../src/config";
import MemoryStorage from "../src/storage/memory";
import Storage from "../src/storage/storage";

describe( 'Config', () => {
  let config: Config = null;

  beforeEach(() => {
    config = new Config();
    config.data = [[1, 2, 3]];
    config.storage = new MemoryStorage(config);
    config.limit = 4;
  });

  it('should have data property', () => {
    expect(config.data).toStrictEqual([[1, 2, 3,]]);
  });

  it('should have limit property', () => {
    expect(config.limit).toBe(4);
  });

  it('should return the correct values', () => {
    expect(config.storage).toBeInstanceOf(Storage);
  });
});
