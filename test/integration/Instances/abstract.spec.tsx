import Abstract from 'instances/types/Instance';
import plusnew from 'index';

describe('Does the root-instance behave correctly', () => {
  let abstract: Abstract;

  beforeEach(() => {
    class TestInstance extends Abstract {
      getLength() {
        return 0;
      }
      move() {}
      remove() {}
      reconcile() {}
    }

    abstract = new TestInstance(<div />, undefined, () => 0);
  });

  it('appendToParent should throw exception', () => {
    const element = document.createElement('div');
    expect(() => abstract.appendToParent(element, 0)).toThrow(new Error('Cant append element to not existing parent'));
  });

  it('appendChild should throw exception', () => {
    const element = document.createElement('div');
    expect(() => abstract.appendChild(element, 0)).toThrow(new Error('Couldn\'t add child to parent'));
  });
});
