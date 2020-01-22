import driver from '@plusnew/driver-dom/src/driver';
import Instance from 'instances/types/Root/Instance';

describe('root', () => {
  it('move', () => {
    expect(() => {
      Instance.prototype.move();
    }).toThrow(new Error('The root element can\'t move itself'));
  });

  it('reconcile', () => {
    expect(() => {
      Instance.prototype.reconcile(false);
    }).toThrow(new Error('The root element can\'t reconcile itself'));
  });

  xit('getFirstIntrinsicElement', () => {
    const instance = new Instance<Element, Text>(true, undefined, () => null, { driver: driver(document.createElement('div')) });
    instance.ref = document.createElement('div');
    expect(instance.getLastIntrinsicInstance()).toBe(instance.ref);
  });
});
