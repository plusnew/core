import Instance from 'instances/types/Placeholder/Instance';

describe('placeholder', () => {
  it('move', () => {
    expect(() => {
      Instance.prototype.move();
    }).toThrow(new Error('Placeholder elements cant be moved'));
  });
});
