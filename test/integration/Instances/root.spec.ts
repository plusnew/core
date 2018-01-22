import Root from 'instances/types/Root/Instance';

describe('Does the root-instance behave correctly', () => {
  let root: Root;
  beforeEach(() => {
    root = new Root('foo', undefined, () => 0);
  });
  
  it('getLength should throw exception', () => {
    expect(() => root.getLength()).toThrow(new Error('getLength of RootElement is irrelevant'));
  });

  it('remove should throw exception', () => {
    expect(() => root.remove()).toThrow(new Error('The root element can\'t remove itself'));
  });
});
