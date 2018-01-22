import Plusnew from 'index';
import reconciler from 'instances/reconciler';

describe('checking if reconciler works as expected', () => {
  describe('placeholder elements', () => {
    let plusnew: Plusnew;
    beforeEach(() => {
      plusnew = new Plusnew();
    });

    it('placeholder same as array', () => {
      expect(reconciler.isSameAbstractElement(false, false)).toBe(true);
    });

    it('placeholder same as array', () => {
      expect(reconciler.isSameAbstractElement(false, [])).toBe(false);
    });
    
    it('placeholder same as array', () => {
      expect(reconciler.isSameAbstractElement(false, <div />)).toBe(false);
    });

    it('placeholder same as array', () => {
      const Component = () => {
        return {
          render: () => plusnew.createElement('div', null),
          dependencies: {},
        };
      };
      expect(reconciler.isSameAbstractElement(false, <Component />)).toBe(false);
    });
  });
});
