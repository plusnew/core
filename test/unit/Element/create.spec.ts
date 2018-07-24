import plusnew, { Consumer, component } from 'index';

describe('checking if createElement works as expected', () => {
  it('Is div element created', () => {
    const instance = plusnew.createElement('div', null);
    expect(instance.type).toBe('div');
  });

  it('Is text element created', () => {
    const instance = plusnew.createElement(0, null);
    expect(instance.type).toBe(0);
  });

  it('Is div props correct created', () => {
    const props = {
      className: 'foo',
    };

    const instance = plusnew.createElement('div', props);
    expect(instance.props).toEqual({ ...props, children: [] });
    // The props should be equal, but not be the same - reference breaking
    expect(instance.props).not.toBe(props as any);
  });

  it('Is div props correct created when null', () => {
    const instance = plusnew.createElement('div', null);
    expect(instance.props).toEqual({ children: [] });
  });

  it('Is div props correct created when adding children', () => {
    const child = plusnew.createElement('span', null);
    const instance = plusnew.createElement('div', null, child);
    expect(instance.props.children.length).toBe(1);
    expect(instance.props.children[0]).toBe(child);
  });

  it('Is div props correct created when adding children without reference', () => {
    const child = plusnew.createElement('span', null);
    const props = {
      className: 'foo',
    };

    const instance = plusnew.createElement('div', props, child);
    expect(instance.props.children.length).toBe(1);
    expect(instance.props.children[0]).toBe(child);
    expect(props).not.toContain('children');
  });

  it('Is div props correct created when creating multiple children', () => {
    const firstChild = plusnew.createElement('span', null);
    const secondChild = plusnew.createElement('ul', null);
    const instance = plusnew.createElement('div', null, firstChild, secondChild);
    expect(instance.props.children[0]).toBe(firstChild);
    expect(instance.props.children[1]).toBe(secondChild);
  });

  it('check if component gets safed', () => {
    const Component = component('Component', () => plusnew.createElement('div', null));

    const props = { foo: 'bar' };
    const instance = plusnew.createElement(Component, props);
    expect(instance.type).toBe(Component);
    expect(instance.props).toEqual({ ...props, children: [] });
    expect(instance.props).not.toBe(props as any);
  });

  it('Is text element created', () => {
    const instance = plusnew.createElement(plusnew.Fragment, null);
    expect(instance.type).toBe(plusnew.Fragment);
  });
});
