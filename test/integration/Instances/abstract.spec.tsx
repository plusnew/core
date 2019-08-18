import Abstract from 'instances/types/Instance';
import plusnew from 'index';
import driver from '@plusnew/driver-dom';

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
    const element = document.createElement('div');
    expect(() => abstract.appendToParent(element, null)).toThrow(new Error('Cant append element to not existing parent'));
  });

  it('appendChild should throw exception', () => {
    const element = document.createElement('div');
    expect(() => abstract.appendChild(element, null)).toThrow(new Error('Couldn\'t add child to parent'));
  });
});
