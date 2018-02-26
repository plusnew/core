import plusnew, { component } from 'index';

describe('dom handling', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('correct handling of acceptCharset', () => {
    const Component = component(
      () => ({}),
      (props: {}) =>
        <form acceptCharset="UTF-8" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLFormElement;

    expect(target.acceptCharset).toBe('UTF-8');
  });

  it('correct handling of class', () => {
    const Component = component(
      () => ({}),
      (props: {}) =>
        <div className="foo" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLElement;

    expect(target.className).toBe('foo');
  });

  it('correct handling of htmlFor', () => {
    const Component = component(
      () => ({}),
      (props: {}) =>
        <label htmlFor="foo" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLLabelElement;

    expect(target.htmlFor).toBe('foo');
  });

  it('correct handling of httpEquiv', () => {
    const Component = component(
      () => ({}),
      (props: {}) =>
        <meta httpEquiv="refresh" />,
    );
    plusnew.render(<Component />, container);

    const target = container.childNodes[0] as HTMLMetaElement;

    expect(target.httpEquiv).toBe('refresh');
  });

});
