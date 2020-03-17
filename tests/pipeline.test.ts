import Pipeline from "../src/pipeline/pipeline";

describe( 'Pipeline class', () => {
  it('should inherit Promise', () => {
    expect(new Pipeline<boolean>(x => x(true))).toBeInstanceOf(Promise);
  });
});
