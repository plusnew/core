import driver from '@plusnew/driver-dom/src/driver';
import '@plusnew/driver-dom/src/jsx';
import plusnew from 'index';
import DomInstance from '@plusnew/core/src/instances/types/Host/Instance';
import Abstract from 'instances/types/Instance';
import types from 'instances/types/types';

xdescribe('Does the root-instance behave correctly', () => {
  let abstract: Abstract<Element, Text>;

  beforeEach(() => {
    class TestInstance extends Abstract<Element, Text> {
      public nodeType = types.Placeholder;
      public type = 'foo';
      getLastIntrinsicInstance(): never {
        throw new Error('mep');
      }
      move() { }
      remove() { }
      reconcile() { }
    }

    abstract = new TestInstance(<div />, undefined, () => null, { driver: driver(document.createElement('div')) });
  });

  it('appendToParent should throw exception', () => {
    const instance = plusnew.render(<div />, { driver: driver(document.createElement('div')) }) as DomInstance<Element, Text>;
    expect(() => abstract.appendToParent(instance, null)).toThrow(new Error('Cant append element to not existing parent'));
  });

  it('appendChild should throw exception', () => {
    const instance = plusnew.render(<div />, { driver: driver(document.createElement('div')) }) as DomInstance<Element, Text>;
    expect(() => abstract.appendChild(instance, null)).toThrow(new Error('Couldn\'t add child to parent'));
  });
});
