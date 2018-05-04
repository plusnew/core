import plusnew from 'index';
import reconciler from 'instances/reconciler';
import factory from 'instances/factory';
import RootInstance from 'instances/types/Root/Instance';
import component from 'components/factory';
import elementTypeChecker from 'util/elementTypeChecker';
import { ApplicationElement } from 'interfaces/component';

function createInstance(applicationElement: ApplicationElement) {
  const wrapper = new RootInstance(true, undefined, () => 0, {});
  wrapper.ref = document.createElement('div');

  return factory(applicationElement, wrapper, () => 0);
}
describe('checking if reconciler works as expected', () => {
  describe('isSameAbstractElement()', () => {
    describe('placeholder elements', () => {
      describe('placeholder', () => {
        it('placeholder same as placeholder', () => {
          expect(reconciler.isSameAbstractElement(false, createInstance(false))).toBe(true);
        });

        it('placeholder same as array', () => {
          expect(reconciler.isSameAbstractElement(false, createInstance([]))).toBe(false);
        });

        it('placeholder same as dom', () => {
          expect(reconciler.isSameAbstractElement(false, createInstance(<div />))).toBe(false);
        });

        it('placeholder same as component', () => {
          const Component = component('Component',() => ({}), () => <div />);
          expect(reconciler.isSameAbstractElement(false, createInstance(<Component />))).toBe(false);
        });
      });

      describe('dom', () => {
        it('same as placeholder', () => {
          expect(reconciler.isSameAbstractElement(<div />, createInstance(false))).toBe(false);
        });

        it('same as array', () => {
          expect(reconciler.isSameAbstractElement(<div />, createInstance([]))).toBe(false);
        });

        it('same as dom, of equal type', () => {
          expect(reconciler.isSameAbstractElement(<div />, createInstance(<div />))).toBe(true);
        });

        it('same as dom, of unequal type', () => {
          expect(reconciler.isSameAbstractElement(<div />, createInstance(<span />))).toBe(false);
        });

        it('same as dom, of equal type, with same key', () => {
          expect(reconciler.isSameAbstractElement(<div key="0" />, createInstance(<div key="0" />))).toBe(true);
        });

        it('same as dom, of equal type, with different key', () => {
          expect(reconciler.isSameAbstractElement(<div key="0" />, createInstance(<div key="1" />))).toBe(false);
        });

        it('same as dom, of equal type, with one key', () => {
          expect(reconciler.isSameAbstractElement(<div key="0" />, createInstance(<div />))).toBe(false);
        });

        it('same as dom, of equal type, with one key', () => {
          expect(reconciler.isSameAbstractElement(<div />, createInstance(<div key="0" />))).toBe(false);
        });

        it('same as component', () => {
          const Component = component('Component',() => ({}), () => <div />);
          expect(reconciler.isSameAbstractElement(false, createInstance(<Component />))).toBe(false);
        });
      });

      describe('Component', () => {
        const Component = component('Component',() => ({}), () => <div />);
        const AnotherComponent = component('Component',() => ({}), () => <div />);

        it('are components the same', () => {
          expect(reconciler.isSameAbstractElement(<Component />, createInstance(<Component />))).toBe(true);
        });

        it('are components the same with same key', () => {
          expect(reconciler.isSameAbstractElement(<Component key={1} />, createInstance(<Component key={1} />))).toBe(true);
        });

        it('are components the same with different key', () => {
          expect(reconciler.isSameAbstractElement(<Component key={1} />, createInstance(<Component key={2} />))).toBe(false);
        });

        it('are different components the same', () => {
          expect(reconciler.isSameAbstractElement(<Component />, createInstance(<AnotherComponent />))).toBe(false);
        });

        it('are different components the same with same key', () => {
          expect(reconciler.isSameAbstractElement(<Component key={1} />, createInstance(<AnotherComponent key={1} />))).toBe(false);
        });

        it('are different components the same with different key', () => {
          expect(reconciler.isSameAbstractElement(<Component key={1} />, createInstance(<AnotherComponent key={2} />))).toBe(false);
        });

        it('are components the same as dom', () => {
          expect(reconciler.isSameAbstractElement(<Component />, createInstance(<div />))).toBe(false);
        });

        it('are components the same as placeholder', () => {
          expect(reconciler.isSameAbstractElement(<Component />, createInstance(false))).toBe(false);
        });

        it('are components the same as text', () => {
          expect(reconciler.isSameAbstractElement(<Component />, createInstance('text'))).toBe(false);
        });
      });
    });
  });

  describe('isSameAbstractElementType()', () => {
    beforeEach(() => {
      spyOn(elementTypeChecker, 'isPlaceholderElement').and.returnValue(false);
      spyOn(elementTypeChecker, 'isTextElement').and.returnValue(false);
      spyOn(elementTypeChecker, 'isArrayElement').and.returnValue(false);
      spyOn(elementTypeChecker, 'isFragmentElement').and.returnValue(false);
      spyOn(elementTypeChecker, 'isDomElement').and.returnValue(false);
      spyOn(elementTypeChecker, 'isComponentElement').and.returnValue(false);

    });
    it('unknown element', () => {
      expect(() => {
        (reconciler as any).isSameAbstractElementType('string', 'another string');
      }).toThrow(new Error('Unknown abstractElement detected'));
    });
  });
});
