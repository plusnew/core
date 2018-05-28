import Abstract from 'instances/types/Instance';
import plusnew from 'index';

describe('Does the root-instance behave correctly', () => {
  let abstract: Abstract;

  beforeEach(() => {
    class TestInstance extends Abstract {
      getLastIntrinsicElement() {
        return null;
      }
      move() {}
      remove() {}
      reconcile() {}
    }

    abstract = new TestInstance(<div />, undefined, () => null);
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
