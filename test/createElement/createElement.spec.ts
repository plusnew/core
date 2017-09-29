import Plusnew from 'index';

describe('checking if createElement works as expected', () => {
  let plusnew: Plusnew;
  beforeEach(() => {
    plusnew = new Plusnew();
  });

  it('Is div element created', () => {
    const instance = plusnew.createElement('div', null);
    expect(instance.type).toBe('div');
  });

  it('Is div props correct created', () => {
    const props = {
      className: 'foo',
    };

    const instance = plusnew.createElement('div', props);
    expect(instance.props).toBe(props);
  });

  it('Is div props correct created when null', () => {
    const instance = plusnew.createElement('div', null);
    expect(instance.props).toEqual({});
  });
});
