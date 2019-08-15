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

  it('getFirstIntrinsicElement', () => {
    const instance = new Instance(true, undefined, () => null, {});
    instance.ref = document.createElement('div');
    expect(instance.getLastIntrinsicInstance()).toBe(instance.ref);
  });
});
