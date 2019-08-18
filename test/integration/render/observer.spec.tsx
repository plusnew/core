import plusnew, { component, store } from 'index';
import driver from '@plusnew/driver-dom';

describe('<Observer />', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('observer are rerendering when store changes', () => {
    const renderSpy = jasmine.createSpy('render', (value: number) => <div>{value}</div>).and.callThrough();
    const local = store(1, (_state, action: number) => action);

    const Component = component(
      'Component',
      () =>
            <local.Observer>{renderSpy}</local.Observer>,
    );

    plusnew.render<Element, Text>(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('1');

    expect(renderSpy.calls.count()).toBe(1);
    expect(renderSpy).toHaveBeenCalledWith(1);

    local.dispatch(2);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('2');

    expect(renderSpy.calls.count()).toBe(2);
    expect(renderSpy).toHaveBeenCalledWith(2);
  });

  it('observer are rerendering when props changes', () => {
    const renderSpy = jasmine.createSpy('render', (value: number) => <div>{value}</div>).and.callThrough();

    const local = store(0, (_state, action: number) => action);
    const localContainer = store(renderSpy, (_state, action: jasmine.Spy) => action);

    const Component = component(
      'Component',
      () =>
            <localContainer.Observer>{state =>
              <local.Observer>{state}</local.Observer>
            }</localContainer.Observer>,
    );

    plusnew.render<Element, Text>(<Component />, { driver: driver(container) });

    const target = (container.childNodes[0] as HTMLElement);
    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');

    expect(renderSpy.calls.count()).toBe(1);
    expect(renderSpy).toHaveBeenCalledWith(0);

    const newRenderSpy = jasmine.createSpy('render', (value: number) => <div>{value}</div>).and.callThrough();
    localContainer.dispatch(newRenderSpy);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe('DIV');
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe('0');
    expect((container.childNodes[0] as HTMLElement)).toBe(target);

    expect(renderSpy.calls.count()).toBe(1);
    expect(newRenderSpy.calls.count()).toBe(1);
    expect(newRenderSpy).toHaveBeenCalledWith(0);
  });
});
