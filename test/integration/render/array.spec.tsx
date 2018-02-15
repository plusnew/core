import plusnew, { store, component } from 'index';

const list = [{ key: 0, value: 'first' }, { key: 1, value: 'second' }, { key: 2, value: 'third' }];
const local = () => store(list, (state, newValue: { key: number; value: string }) => [newValue, ...state]);

describe('rendering nested components', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('does a initial list work, with pushing values', () => {
    const Component = component(
      () => ({ local: local() }),
      (props: {}, { local }) => <ul>{local.state.map(item => <li key={item.key}>{item.value}</li>)}</ul>,
    );

    plusnew.render(Component, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(list.length);
    ul.childNodes.forEach((li: Node, index) => {
      expect((li as HTMLElement).tagName).toBe('LI');
      expect((li as HTMLElement).innerHTML).toBe(list[index].value);
    });
  });

  it('does a initial list work, appended li', () => {
    const list = ['first', 'second', 'third'];
    const Component = component(
      () => ({ local: local() }),
      (props: {}, { local }) => (
        <ul>
          {local.state.map(item => <li key={item.key}>{item.value}</li>)}
          <li>foo</li>
        </ul>
      ),
    );

    plusnew.render(Component, container);

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
    const dependencies = {
      local: store([] as typeof list, (store, action: typeof list) => action),
    };

    const Component = component(
      () => dependencies,
      (props: {}, { local }) => <ul>{local.state.map(item => <li key={item.key}>{item.value}</li>)}</ul>,
    );

    plusnew.render(Component, container);

    const ul = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect(ul.tagName).toBe('UL');
    expect(ul.childNodes.length).toBe(0);

    dependencies.local.dispatch(list);
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
    const dependencies = {
      local: store(list, (previousStore, action: typeof list) => action),
    };

    const Component = component(
      () => dependencies,
      (props: {}, { local }) => <ul>{local.state.map(item => <li key={item.key}>{item.value}</li>)}</ul>,
    );

    plusnew.render(Component, container);

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

    dependencies.local.dispatch(newList);

    expect(ul.childNodes.length).toBe(newList.length);

    newList.forEach((newListItem, newListIndex) => {
      for (let i = 0; i < list.length; i += 1) {
        if (newListItem.key === list[i].key) {
          expect(ul.childNodes[newListIndex]).toBe(initialList[i]);
        }
      }
      expect((ul.childNodes[newListIndex] as HTMLElement).tagName).toBe('LI');
      expect((ul.childNodes[newListIndex] as HTMLElement).innerHTML).toBe(newListItem.value);
    });
  });

  it('rerendering with different order and inserted elements', () => {
    const dependencies = {
      local: store(list, (previousStore, action: typeof list) => action),
    };

    const PartialComponent = component(() => {}, (props: { value: string }) => <span>{props.value}</span>);

    const MainComponent = component(
      () => dependencies,
      (props: {}, { local }) => (
        <span>{local.state.map(item => <PartialComponent key={item.key} value={item.value} />)}</span>
      ),
    );

    plusnew.render(MainComponent, container);

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

    dependencies.local.dispatch(newList);

    expect(span.childNodes.length).toBe(3);

    newList.forEach((newListItem, newListIndex) => {
      for (let i = 0; i < list.length; i += 1) {
        if (newListItem.key === list[i].key) {
          expect(span.childNodes[newListIndex]).toBe(initialList[i]);
        }
      }

      expect((span.childNodes[newListIndex] as Text).textContent).toBe(newListItem.value);
    });
  });

  it('rerendering with different order and inserted elements', () => {
    const dependencies = {
      local: store(list, (previousStore, action: typeof list) => action),
    };

    const PartialComponent = component(
      () => ({}),
      (props: { value: string }) => [<span key={0}>{props.value}0</span>, <div key={1}>{props.value}1</div>] as any,
    );

    const MainComponent = component(
      () => dependencies,
      (props, { local }: typeof dependencies) => (
        <span>{local.state.map(item => <PartialComponent key={item.key} value={item.value} />)}</span>
      ),
    );

    plusnew.render(MainComponent, container);

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

    dependencies.local.dispatch(newList);

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
    const dependencies = {
      local: store([] as typeof list, (previousStore, action: typeof list) => action),
    };

    const PartialComponent = component(
      () => ({}),
      () => <span>some other element</span>,
    );

    const MainComponent = component(
      () => dependencies,
      (props, { local }) =>
        <div>
          <div />
          <div>
            {local.state.map(item => <div key={item.key}>{item.value}</div>)}
            <PartialComponent />
          </div>
        </div>,
    );

    plusnew.render(MainComponent, container);

    const div = container.childNodes[0].childNodes[1] as HTMLElement;
    expect(div.childNodes.length).toBe(1);
    const partialElement = (div.childNodes[0] as HTMLElement);
    expect(partialElement.tagName).toBe('SPAN');
    expect(partialElement.innerHTML).toBe('some other element');

    dependencies.local.dispatch([{ key: 0, value: 'entity1' }, { key: 1, value: 'entity2' }]);

    expect(div.childNodes.length).toBe(3);

    expect((div.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((div.childNodes[0] as HTMLElement).innerHTML).toBe('entity1');
    expect((div.childNodes[1] as HTMLElement).tagName).toBe('DIV');
    expect((div.childNodes[1] as HTMLElement).innerHTML).toBe('entity2');
    expect((div.childNodes[2] as HTMLElement)).toBe(partialElement);
    expect((div.childNodes[2] as HTMLElement).tagName).toBe('SPAN');
    expect((div.childNodes[2] as HTMLElement).innerHTML).toBe('some other element');
  });
});
