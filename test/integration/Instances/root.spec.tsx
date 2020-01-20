import driver from '@plusnew/driver-dom';
import plusnew from 'index';
import Root from 'instances/types/Root/Instance';

describe('Does the root-instance behave correctly', () => {
  let root: Root<Element, Text>;

  beforeEach(() => {
    root = new Root<Element, Text>(<div />, undefined, () => null, { driver: driver(document.createElement('div')) });
  });

  it('remove should throw exception', () => {
    expect(() => root.remove()).toThrow(new Error('The root element can\'t remove itself'));
  });
});
