import { main } from '../src/main';

describe( 'main function', () => {
  it('testing param', () => {
    expect(main("boo")).toBe("boo");
  });
});
