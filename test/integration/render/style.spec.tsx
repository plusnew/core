import plusnew, { component, store } from 'index';
import driver from '@plusnew/driver-dom';

describe('dom handling', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('updating style attributes', () => {
    const local = store('20px', (state, action: string) => action);

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          <div style={{ width: state }} />
        }</local.Observer>,
    );

    plusnew.render<Element, Text>(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLDivElement;
    expect(target.style.width).toBe('20px');

    local.dispatch('30px');

    expect(target.style.width).toBe('30px');
  });

  it('removing style attributes', () => {
    const local = store(true, (state, action: boolean) => action);

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          state ?
            <div />
          :
            <div style={{ width: '20px' }} />
        }</local.Observer>,
    );

    plusnew.render<Element, Text>(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLDivElement;
    expect(target.style.width).toBe('');

    local.dispatch(false);

    expect(target.style.width).toBe('20px');

    local.dispatch(true);

    expect(target.style.width).toBe('');
  });

  it('updating style attributes', () => {
    const local = store(true, (state, action: boolean) => action);

    const Component = component(
      'Component',
      () =>
        <local.Observer>{state =>
          state ?
            <div style={{ width: '30px' }}/>
          :
            <div style={{ width: '30px', height: '20px' }} />
        }</local.Observer>,
    );

    plusnew.render<Element, Text>(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLDivElement;
    expect(target.style.width).toBe('30px');
    expect(target.style.height).toBe('');

    local.dispatch(false);

    expect(target.style.width).toBe('30px');
    expect(target.style.height).toBe('20px');

    local.dispatch(true);

    expect(target.style.width).toBe('30px');
    expect(target.style.height).toBe('');
  });

  it('updating style invalidattributes', () => {
    const Component = component(
      'Component',
      () => <div style={{ width: 'foo' }}/>,
    );

    plusnew.render<Element, Text>(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLDivElement;
    expect(target.getAttribute('style')).toBe('width:foo;');
    expect(target.style.width).toBe('');
  });
});
