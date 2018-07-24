import plusnew, { Consumer, store, component } from 'index';

const list = [{ key: 0, value: 'first' }, { key: 1, value: 'second' }, { key: 2, value: 'third' }];
const localFactory = () => store(list, (state, newValue: { key: number; value: string }) => [newValue, ...state]);

describe('rendering nested components', () => {
  let container: HTMLElement;
  let moveSpy: jasmine.Spy;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);

    moveSpy = spyOn(HTMLElement.prototype, 'insertBefore').and.callThrough();
  });

  it('does a initial list work, with pushing values with placeholder', () => {
    const local = localFactory();
    const Component = component(
      'Component',
      () => <ul><local.Consumer render={local => local.map(item => <li key={item.key}>{item.value}</li>)} /></ul>,
    );

    plusnew.render(<Component />, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(list.length);
    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      expect((li as HTMLElement).innerHTML).toBe(list[index].value);
    });
  });

  it('does a initial list work, appended li with placeholder', () => {
    const local = localFactory();
    const list = ['first', 'second', 'third'];
    const Component = component(
      'Component',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => <li key={item.key}>{item.value}</li>)} />
          <li>foo</li>
        </ul>
      ),
    );

    plusnew.render(<Component />, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(list.length + 1);
    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      if (index === 3) {
        expect((li as HTMLElement).innerHTML).toBe('foo');
      } else {
        expect((li as HTMLElement).innerHTML).toBe(list[index]);
      }
    });
  });

  it('does a initial empty list work, and updating it', () => {
    const local =  store([] as typeof list, (store, action: typeof list) => action);

    const Component = component(
      'Component',
      () => <ul><local.Consumer render={local => local.map(item => <li key={item.key}>{item.value}</li>)} /></ul>,
    );

    plusnew.render(<Component />, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(0);

    local.dispatch(list);

    expect(ul.childNodes.length).toBe(list.length);

    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      if (index === 3) {
        expect((li as HTMLElement).innerHTML).toBe('foo');
      } else {
        expect((li as HTMLElement).innerHTML).toBe(list[index].value);
      }
    });
  });

  it('rerendering with different order and inserted elements', () => {
    const local =  store(list, (previousStore, action: typeof list) => action);

    const Component = component(
      'Component',
      () => <ul><local.Consumer render={local => local.map(item => <li key={item.key}>{item.value}</li>)} /></ul>,
    );

    plusnew.render(<Component />, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(list.length);
    const initialList: Node[] = [];
    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      expect((li as HTMLElement).innerHTML).toBe(list[index].value);
      initialList.push(li);
    });

    const newList = [
      { key: 1, value: 'previously second' },
      { key: 4, value: 'zero' },
      { key: 2, value: 'previously third' },
      { key: 0, value: 'previously first' },
    ];

    local.dispatch(newList);

    expect(ul.childNodes.length).toBe(newList.length);

    newList.forEach((newListItem, newListIndex) => {
      for (let i = 0; i < list.length; i += 1) {
        if (newListItem.key === list[i].key) {
          expect(ul.childNodes[newListIndex] as Node).toBe(initialList[i]);
        }
      }
      expect((ul.childNodes[newListIndex] as HTMLElement).tagName).toBe('LI');
      expect((ul.childNodes[newListIndex] as HTMLElement).innerHTML).toBe(newListItem.value);
    });
  });

  it('rerendering with different order and inserted elements', () => {
    const local = store(list, (previousStore, action: typeof list) => action);

    const PartialComponent = component(
      'Component',
      (Props: Consumer<{ value: string }>) => <span><Props render={props => props.value} /></span>);

    const MainComponent = component(
      'Component',
      () => (
        <span><local.Consumer render={local => local.map(item => <PartialComponent key={item.key} value={item.value} />)} /></span>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const span = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(span.tagName).toBe('SPAN');
    expect(span.childNodes.length).toBe(list.length);
    const initialList: Node[] = [];
    span.childNodes.forEach((li: Node, index) => {
      expect((li as Text).textContent).toBe(list[index].value);
      initialList.push(li);
    });

    const newList = [
      { key: 2, value: 'previously third' },
      { key: 1, value: 'previously second' },
      { key: 4, value: 'zero' },
    ];

    local.dispatch(newList);

    expect(span.childNodes.length).toBe(3);

    newList.forEach((newListItem, newListIndex) => {
      for (let i = 0; i < list.length; i += 1) {
        if (newListItem.key === list[i].key) {
          expect(span.childNodes[newListIndex] as Node).toBe(initialList[i]);
        }
      }

      expect((span.childNodes[newListIndex] as Text).textContent).toBe(newListItem.value);
    });
  });

  it('rerendering with different order and inserted elements', () => {
    const local = store(list, (previousStore, action: typeof list) => action);

    const PartialComponent = component(
      'Component',
      (Props: Consumer<{ value: string }>) => [<span key={0}><Props render={props => props.value} />0</span>, <div key={1}><Props render={props => props.value} />1</div>] as any,
    );

    const MainComponent = component(
      'Component',
      () => (
        <local.Consumer render={state => <span><local.Consumer render={local => local.map(item => <PartialComponent key={item.key} value={item.value} />)} /></span>} />
      ),
    );

    plusnew.render(<MainComponent />, container);

    const span = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(span.tagName).toBe('SPAN');
    expect(span.childNodes.length).toBe(list.length * 2);
    const initialList: (HTMLElement[])[] = [];
    list.forEach((listItem, index) => {
      const firstChild = span.childNodes[index * 2] as HTMLSpanElement;
      const secondChild = span.childNodes[index * 2 + 1] as HTMLDivElement;

      expect(firstChild.tagName).toBe('SPAN');
      expect(firstChild.innerHTML).toBe(listItem.value + 0);
      expect(secondChild.tagName).toBe('DIV');
      expect(secondChild.innerHTML).toBe(listItem.value + 1);

      initialList.push([firstChild, secondChild]);
    });

    const newList = [
      { key: 2, value: 'previously third' },
      { key: 1, value: 'previously second' },
      { key: 4, value: 'zero' },
    ];

    local.dispatch(newList);

    expect(span.childNodes.length).toBe(newList.length * 2);

    newList.forEach((newListItem, newListIndex) => {
      const firstChild = span.childNodes[newListIndex * 2] as HTMLElement;
      const secondChild = span.childNodes[newListIndex * 2 + 1] as HTMLElement;

      for (let i = 0; i < list.length; i += 1) {
        if (newListItem.key === list[i].key) {
          expect(firstChild).toBe(initialList[i][0]);
          expect(secondChild).toBe(initialList[i][1]);
        }
      }
      expect(firstChild.tagName).toBe('SPAN');
      expect(firstChild.innerHTML).toBe(newListItem.value + 0);
      expect(secondChild.tagName).toBe('DIV');
      expect(secondChild.innerHTML).toBe(newListItem.value + 1);
    });
  });

  it('updating should insert correct next to siblings', () => {
    const local = store([] as typeof list, (previousStore, action: typeof list) => action);

    const PartialComponent = component(
      'Component',
       () => <span>some other element</span>,
    );

    const MainComponent = component(
      'Component',
      () =>
        <div>
          <div />
          <div>
            <local.Consumer render={local => local.map(item => <div key={item.key}>{item.value}</div>)
            } />
            <PartialComponent />
          </div>
        </div>,
    );

    plusnew.render(<MainComponent />, container);

    const div = container.childNodes[0].childNodes[1] as HTMLElement;
    expect(div.childNodes.length).toBe(1);
    const partialElement = (div.childNodes[0] as HTMLElement);
    expect(partialElement.tagName).toBe('SPAN');
    expect(partialElement.innerHTML).toBe('some other element');

    local.dispatch([{ key: 0, value: 'entity1' }, { key: 1, value: 'entity2' }]);

    expect(div.childNodes.length).toBe(3);

    expect((div.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((div.childNodes[0] as HTMLElement).innerHTML).toBe('entity1');
    expect((div.childNodes[1] as HTMLElement).tagName).toBe('DIV');
    expect((div.childNodes[1] as HTMLElement).innerHTML).toBe('entity2');
    expect((div.childNodes[2] as HTMLElement)).toBe(partialElement);
    expect((div.childNodes[2] as HTMLElement).tagName).toBe('SPAN');
    expect((div.childNodes[2] as HTMLElement).innerHTML).toBe('some other element');
  });

  it('updating component with text', () => {
    const local = store([{ key: 0 }, { key: 1 }], (previousStore, action: {key: number}[]) => action);

    const PartialComponent = component(
      'Component',
      (Props: Consumer<{key: number}>) => <Props render={props => 'element' + props.key} />,
    );

    const MainComponent = component(
      'Component',
      () =>
        <div>
          <local.Consumer render={local => local.map(item => <PartialComponent key={item.key} />)
          } />
        </div>,
    );

    plusnew.render(<MainComponent />, container);

    const div = container.childNodes[0] as HTMLElement;
    expect(div.childNodes.length).toBe(2);
    const firstText = div.childNodes[0] as Text;
    const secondText = div.childNodes[1] as Text;
    expect(firstText.textContent).toBe('element0');
    expect(secondText.textContent).toBe('element1');

    local.dispatch([{ key: 1 }, { key: 0 }]);

    expect(div.childNodes.length).toBe(2);

    expect(div.childNodes[0] as Text).toBe(secondText);
    expect(secondText.textContent).toBe('element1');
    expect(div.childNodes[1] as Text).toBe(firstText);
    expect(firstText.textContent).toBe('element0');
  });

  it('moving component with boolean', () => {
    const local = store([{ key: 0 }, { key: 1 }], (previousStore, action: {key: number}[]) => action);

    const PartialComponent = component(
      'Component',
      (Props: Consumer<{key: number}>) => <Props render={props => props.key === 0 ? 'foo' : false} />,
    );

    const MainComponent = component(
      'Component',
      () =>
        <div>
          <local.Consumer render={local => local.map(item => <PartialComponent key={item.key} />)
          } />
        </div>,
    );

    plusnew.render(<MainComponent />, container);

    const div = container.childNodes[0] as HTMLElement;
    expect(div.childNodes.length).toBe(1);
    const firstText = div.childNodes[0] as Text;
    expect(firstText.textContent).toBe('foo');

    local.dispatch([{ key: 1 }, { key: 0 }]);

    expect(div.childNodes.length).toBe(1);

    expect(div.childNodes[0] as Text).toBe(firstText);
    expect(firstText.textContent).toBe('foo');
  });

  it('not moving when element got removed', () => {
    const list = [{ key: 0, value: 'first' }, { key: 1, value: 'second' }, { key: 2, value: 'third' }];
    const local = store(list, (state, newValues: { key: number; value: string }[]) => newValues);

    const Component = component(
      'Component',

      () => (
        <ul>
          <local.Consumer render={local => local.map(item => <li key={item.key}>{item.value}</li>)} />
        </ul>
      ),
    );

    plusnew.render(<Component />, container);

    const ul = container.childNodes[0];

    expect(ul.childNodes.length).toBe(3);
    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[0] as HTMLElement).innerHTML).toBe('first');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[1] as HTMLElement).innerHTML).toBe('second');
    expect((ul.childNodes[2] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[2] as HTMLElement).innerHTML).toBe('third');

    moveSpy.calls.reset();

    local.dispatch([list[0], list[2]]);

    expect(ul.childNodes.length).toBe(2);
    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[0] as HTMLElement).innerHTML).toBe('first');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[1] as HTMLElement).innerHTML).toBe('third');

    expect(moveSpy.calls.count()).toBe(0);
  });

  it('last element got removed', () => {
    const list = [{ key: 0, value: 'first' }, { key: 1, value: 'second' }, { key: 2, value: 'third' }];
    const local = store(list, (state, newValues: { key: number; value: string }[]) => newValues);

    const Component = component(
      'Component',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => <li key={item.key}>{item.value}</li>)} />
        </ul>
      ),
    );

    plusnew.render(<Component />, container);

    const ul = container.childNodes[0];

    expect(ul.childNodes.length).toBe(3);
    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[0] as HTMLElement).innerHTML).toBe('first');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[1] as HTMLElement).innerHTML).toBe('second');
    expect((ul.childNodes[2] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[2] as HTMLElement).innerHTML).toBe('third');

    local.dispatch([list[0], list[1]]);

    expect(ul.childNodes.length).toBe(2);
    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[0] as HTMLElement).innerHTML).toBe('first');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[1] as HTMLElement).innerHTML).toBe('second');
  });


  it('removed without key property', () => {
    const list = [{ key: 0, value: 'first' }, { key: 1, value: 'second' }, { key: 2, value: 'third' }];
    const local = store(list, (state, newValues: { key: number; value: string }[]) => newValues);

    const Component = component(
      'Component',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => <li>{item.value}</li>)} />
        </ul>
      ),
    );

    plusnew.render(<Component />, container);

    const ul = container.childNodes[0];

    expect(ul.childNodes.length).toBe(3);
    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[0] as HTMLElement).innerHTML).toBe('first');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[1] as HTMLElement).innerHTML).toBe('second');
    expect((ul.childNodes[2] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[2] as HTMLElement).innerHTML).toBe('third');

    local.dispatch([list[0], list[2]]);

    expect(ul.childNodes.length).toBe(2);
    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[0] as HTMLElement).innerHTML).toBe('first');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('LI');
    expect((ul.childNodes[1] as HTMLElement).innerHTML).toBe('third');
  });

  it('ordering with empty elements in between', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => false as any,
    );

    const list: plusnew.JSX.Element[] = [
      <span key={0} />,
      <NestedComponent key={1} />,
      <div key={2} />,
    ];

    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('DIV');

    local.dispatch([
      <div key={2} />,
      <NestedComponent key={1} />,
      <span key={0} />,
    ]);

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
  });

  it('ordering with empty elements on end', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => <></>,
    );

    const list: plusnew.JSX.Element[] = [
      <NestedComponent key={1} />,
      <span key={0} />,
    ];

    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    local.dispatch([
      <span key={0} />,
      <NestedComponent key={1} />,
    ]);

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  });

  it('ordering with empty elements on beginning', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => <></>,
    );

    const list: plusnew.JSX.Element[] = [
      <span key={0} />,
      <NestedComponent key={1} />,
    ];

    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    local.dispatch([
      <NestedComponent key={1} />,
      <span key={0} />,
    ]);

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  });


  it('ordering with empty elements in between with placeholder', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => false as any,
    );

    const list: plusnew.JSX.Element[] = [
      <span key={0} />,
      <NestedComponent key={1} />,
      <div key={2} />,
    ];

    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('DIV');

    local.dispatch([
      <div key={2} />,
      <NestedComponent key={1} />,
      <span key={0} />,
    ]);

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
  });

  it('ordering with empty elements on end with placeholder', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => false as any,
    );

    const list: plusnew.JSX.Element[] = [
      <NestedComponent key={1} />,
      <span key={0} />,
    ];

    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    local.dispatch([
      <span key={0} />,
      <NestedComponent key={1} />,
    ]);

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  });

  it('ordering with empty elements on beginning with placeholder', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => false as any,
    );

    const list: plusnew.JSX.Element[] = [
      <span key={0} />,
      <NestedComponent key={1} />,
    ];

    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');

    local.dispatch([
      <NestedComponent key={1} />,
      <span key={0} />,
    ]);

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
  });

  it('ordering with text in between', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => 'foo' as any,
    );

    const list: plusnew.JSX.Element[] = [
      <span key={0} />,
      <NestedComponent key={1} />,
      <div key={2} />,
    ];

    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((ul.childNodes[1] as Text).textContent).toBe('foo');
    expect((ul.childNodes[2] as HTMLElement).tagName).toBe('DIV');

    local.dispatch([
      <div key={2} />,
      <NestedComponent key={1} />,
      <span key={0} />,
    ]);

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((ul.childNodes[1] as Text).textContent).toBe('foo');
    expect((ul.childNodes[2] as HTMLElement).tagName).toBe('SPAN');
  });

  it('ordering with text on end', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => 'foo' as any,
    );

    const list: plusnew.JSX.Element[] = [
      <NestedComponent key={1} />,
      <span key={0} />,
    ];

    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    expect((ul.childNodes[0] as Text).textContent).toBe('foo');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('SPAN');

    local.dispatch([
      <span key={0} />,
      <NestedComponent key={1} />,
    ]);

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((ul.childNodes[1] as Text).textContent).toBe('foo');
  });

  it('ordering with text on beginning', () => {
    const NestedComponent = component(
      'NestedComponent',
      () => 'foo' as any,
    );

    const list: plusnew.JSX.Element[] = [
      <span key={0} />,
      <NestedComponent key={1} />,
    ];

    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((ul.childNodes[1] as Text).textContent).toBe('foo');

    local.dispatch([
      <NestedComponent key={1} />,
      <span key={0} />,
    ]);

    expect((ul.childNodes[0] as Text).textContent).toBe('foo');
    expect((ul.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
  });

  it('ordering with text on beginning', () => {
    const list = [null, <div key={1} />] as plusnew.JSX.Element[];
    const local = store(list, (state, action: typeof list) => action);

    const MainComponent = component(
      'MainComponent',
      () => (
        <ul>
          <local.Consumer render={local => local.map(item => item)} />
        </ul>
      ),
    );

    plusnew.render(<MainComponent />, container);

    const ul = container.childNodes[0];

    const div = (ul.childNodes[0] as HTMLElement);
    expect(div.tagName).toBe('DIV');

    local.dispatch([<div key={1} />, null] as typeof list);

    expect((ul.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect(ul.childNodes[0]).toBe(div);
  });
});
