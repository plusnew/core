import Instance from 'instances/types/Root/Instance';

describe('root', () => {
  it('move', () => {
    expect(() => {
      Instance.prototype.move();
    }).toThrow(new Error('The root element can\'t move itself'));
  });

  it('move', () => {
    expect(() => {
      Instance.prototype.reconcile(false);
    }).toThrow(new Error('The root element can\'t reconcile itself'));
  });
});
