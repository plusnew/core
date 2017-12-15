import store from 'redchain';
import Plusnew from 'index';
import component from 'interfaces/component';

describe('rendering nested components', () => {
  let plusnew: Plusnew;
  let container: HTMLElement;

  beforeEach(() => {
    plusnew = new Plusnew();

    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('does a initial list work, with pushing values', () => {
    const list = ['first', 'second', 'third'];
    const dependencies = {
      local: store((state: string[] | null, action: { type: string, payload?: string }) => {
        if (state === null) {
          return list;
        }
        if (action.payload) {
          return [...state, action.payload];
        }
        return state;
      }),
    };

    const MainComponent: component<{}, typeof dependencies> = () => {
      return {
        dependencies,
        render: (props, { local }: typeof dependencies) => <ul>{local.state.map((value, index) => <li key={index}>{value}</li>)}</ul>,
      };
    };

    plusnew.render(MainComponent, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(3);
    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      expect((li as HTMLElement).innerHTML).toBe(list[index]);
    });
  });


  it('does a initial list work, with pushing values', () => {
    const list = ['first', 'second', 'third'];
    const dependencies = {
      local: store((state: string[] | null, action: { type: string, payload?: string }) => {
        if (state === null) {
          return list;
        }
        if (action.payload) {
          return [...state, action.payload];
        }
        return state;
      }),
    };

    const MainComponent: component<{}, typeof dependencies> = () => {
      return {
        dependencies,
        render: (props, { local }: typeof dependencies) => <ul>{local.state.map((value, index) => <li key={index}>{value}</li>)}<li>foo</li></ul>,
      };
    };

    plusnew.render(MainComponent, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(4);
    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      if (index === 3) {
        expect((li as HTMLElement).innerHTML).toBe('foo');
      } else {
        expect((li as HTMLElement).innerHTML).toBe(list[index]);
      }
    });
  });
});