import plusnew, { Props, store, component } from 'index';
import driver from '@plusnew/driver-dom';

describe('fragments', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('rendering basic fragment', () => {
    const MainComponent = component(
      'Component',
      () =>
        <>
          <span>foo</span>
          <div>bar</div>
        </>,
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe('bar');
  });

  it('moving fragments', () => {
    type entity = {key: number, value: string};
    const list = store([{ key: 1, value: 'one' }], (_state, action: entity[]) => action);

    const PartialComponent = component(
      'PartialComponent',
      (Props: Props<{value: string}>) =>
        <>
          <span><Props>{props => `${props.value}-foo`}</Props></span>
          <div><Props>{props => `${props.value}-bar`}</Props></div>
        </>,
    );
    const MainComponent = component(
      'MainComponent',
      () =>
        <div>
          <list.Observer>{state =>
            state.map(entity =>
              <PartialComponent key={entity.key} value={entity.value} />,
            )
          }</list.Observer>
        </div>,
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    const div = container.childNodes[0];
    expect(div.childNodes.length).toBe(2);
    const firstSpan = (div.childNodes[0] as HTMLElement);
    const firstDiv = (div.childNodes[1] as HTMLElement);

    expect(firstSpan.tagName).toBe('SPAN');
    expect(firstSpan.innerHTML).toBe('one-foo');
    expect(firstDiv.tagName).toBe('DIV');
    expect(firstDiv.innerHTML).toBe('one-bar');

    list.dispatch([{ key: 0, value: 'zero' }, { key: 1, value: 'one' }, { key: 1, value: 'two' }]);

    expect(div.childNodes.length).toBe(6);

    expect((div.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((div.childNodes[0] as HTMLElement).innerHTML).toBe('zero-foo');
    expect((div.childNodes[1] as HTMLElement).tagName).toBe('DIV');
    expect((div.childNodes[1] as HTMLElement).innerHTML).toBe('zero-bar');
    expect((div.childNodes[2] as HTMLElement).tagName).toBe('SPAN');
    expect((div.childNodes[2] as HTMLElement).innerHTML).toBe('one-foo');
    expect((div.childNodes[2] as HTMLElement)).toBe(firstSpan);
    expect((div.childNodes[3] as HTMLElement).tagName).toBe('DIV');
    expect((div.childNodes[3] as HTMLElement).innerHTML).toBe('one-bar');
    expect((div.childNodes[3] as HTMLElement)).toBe(firstDiv);
    expect((div.childNodes[4] as HTMLElement).tagName).toBe('SPAN');
    expect((div.childNodes[4] as HTMLElement).innerHTML).toBe('two-foo');
    expect((div.childNodes[5] as HTMLElement).tagName).toBe('DIV');
    expect((div.childNodes[5] as HTMLElement).innerHTML).toBe('two-bar');
  });

  it('replacing children of fragments', () => {
    const local = store(true, (_state, action: boolean) => action);
    const MainComponent = component(
      'Component',
      () =>
        <>
          <local.Observer>{state =>
            state ? <span>foo</span> : <div>bar</div>
          }</local.Observer>
        </>,
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo');

    local.dispatch(false);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('bar');
  });

  it('replacing children of fragments', () => {
    const local = store(true, (_state, action: boolean) => action);
    const MainComponent = component(
      'Component',
      () =>
        <local.Observer>{state =>
          state ?
            <>
              <span>foo</span>
            </>
          :
            <>
              <span>bar</span>
              <span>baz</span>
            </>
        }</local.Observer>,
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo');

    local.dispatch(false);

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('bar');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe('baz');

    local.dispatch(true);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo');
  });

  it('removing multiple children one at a time', () => {
    const local = store(0, (_state, action: number) => action);

    const MainComponent = component(
      'Component',
      () =>
        <local.Observer>{(state) => {
          if (state === 0) {
            return (
              <>
                <span>foo1</span>
                <span>foo2</span>
                <span>foo3</span>
            </>);
          }
          if (state === 1) {
            return (
              <>
                <span>foo1</span>
                <span>foo2</span>
            </>);
          }

          if (state === 2) {
            return (
              <>
                <span>foo1</span>
            </>);
          }

          return <></>;
        }}</local.Observer>,
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(3);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo1');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe('foo2');
    expect((container.childNodes[2] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[2] as HTMLElement).innerHTML).toBe('foo3');

    local.dispatch(1);

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo1');
    expect((container.childNodes[1] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe('foo2');

    local.dispatch(2);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('SPAN');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('foo1');

    local.dispatch(3);

    expect(container.childNodes.length).toBe(0);
  });
});
