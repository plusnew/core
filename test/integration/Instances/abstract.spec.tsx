import driver from '@plusnew/driver-dom';
import plusnew from 'index';
import DomInstance from 'instances/types/Dom/Instance';
import Abstract from 'instances/types/Instance';

xdescribe('Does the root-instance behave correctly', () => {
  let abstract: Abstract<Element, Text>;

  beforeEach(() => {
    class TestInstance extends Abstract<Element, Text> {
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
