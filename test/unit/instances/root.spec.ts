import Instance from 'instances/types/Root/Instance';

describe('root', () => {
  it('move', () => {
    expect(() => {
      Instance.prototype.move();
    }).toThrow(new Error('The root element can\'t remove itself'));
  });
});
