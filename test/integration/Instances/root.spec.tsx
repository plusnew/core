import Root from 'instances/types/Root/Instance';
import plusnew from 'index';

describe('Does the root-instance behave correctly', () => {
  let root: Root;

  beforeEach(() => {
    root = new Root(<div />, undefined, () => null);
  });

  it('remove should throw exception', () => {
    expect(() => root.remove()).toThrow(new Error('The root element can\'t remove itself'));
  });
});
