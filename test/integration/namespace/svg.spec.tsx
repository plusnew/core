import plusnew, { component, store } from 'index';

const htmlNamespace = 'http://www.w3.org/1999/xhtml';
const svgNamespace = 'http://www.w3.org/2000/svg';

describe('rendering svg components', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('check if div element has correct namespace', () => {
    const Component = component(
      'Component',
      () => <div />,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes[0].namespaceURI).toBe(htmlNamespace);
  });

  it('check if nested div element has correct namespace', () => {
    const Component = component(
      'Component',
      () => <span><div /></span>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes[0].namespaceURI).toBe(htmlNamespace);
    expect(container.childNodes[0].childNodes[0].namespaceURI).toBe(htmlNamespace);

  });

  it('check if svg element has correct namespace', () => {
    const Component = component(
      'Component',
      () => <svg />,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes[0].namespaceURI).toBe(svgNamespace);
  });

  it('check if nested svg element has correct namespace', () => {
    const Component = component(
      'Component',
      () => <span><svg /></span>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes[0].namespaceURI).toBe(htmlNamespace);
    expect(container.childNodes[0].childNodes[0].namespaceURI).toBe(svgNamespace);
  });

  it('check if nested element in svg element has correct namespace', () => {
    const Component = component(
      'Component',
      () => <svg><g /></svg>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes[0].namespaceURI).toBe(svgNamespace);
    expect(container.childNodes[0].childNodes[0].namespaceURI).toBe(svgNamespace);
  });

  it('check if nested element in svg element has correct namespace', () => {
    const Component = component(
      'Component',
      () => <svg><foreignObject ><div xmlns={htmlNamespace}/></foreignObject></svg>,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes[0].namespaceURI).toBe(svgNamespace);
    expect(container.childNodes[0].childNodes[0].namespaceURI).toBe(svgNamespace);
    expect(container.childNodes[0].childNodes[0].childNodes[0].namespaceURI).toBe(htmlNamespace);
  });

  it('check if element with renderoption is set to the namespace', () => {
    const Component = component(
      'Component',
      () => <g />,
    );

    plusnew.render(<Component />, container, { xmlns: svgNamespace });

    expect(container.childNodes[0].namespaceURI).toBe(svgNamespace);
  });

  it('check if dom element has correct namespace, after replacement from svg', () => {
    const local = store(true);
    const Component = component(
      'Component',
      () => <local.Observer>{localState => localState ? <svg /> : <div />}</local.Observer> ,
    );

    plusnew.render(<Component />, container);

    expect(container.childNodes[0].namespaceURI).toBe(svgNamespace);

    local.dispatch(false);

    expect(container.childNodes[0].namespaceURI).toBe(htmlNamespace);
  });

  it('check if namespace prefix is set correctly', () => {
    const xlinkNamespaceUrl = 'http://www.w3.org/1999/xlink';

    const xlinkNamespace = {
      'xmlns:xlink': xlinkNamespaceUrl,
    };

    const xlink = {
      'xlink:href': 'someValue',
    };

    const Component = component(
      'Component',
      () =>
        <svg xmlns={svgNamespace} {...xlinkNamespace}>
          <use {...xlink} />{/** we have to use the spread operator, because namespace prefixes are not allowed in jsx */}
        </svg>,
    );

    plusnew.render(<Component />, container);

    expect(
      (container.childNodes[0].childNodes[0] as SVGUseElement).getAttributeNS(xlinkNamespaceUrl, 'href'),
    ).toBe('someValue');
  });

  it('throw exception when namespace prefix is not known', () => {
    const xlink = {
      'xlink:href': 'someValue',
    };

    const Component = component(
      'Component',
      () =>
        <svg xmlns={svgNamespace}>
          <use {...xlink} />
        </svg>,
    );

    expect(() =>
      plusnew.render(<Component />, container),
    ).toThrow(new Error('The namespace prefix xlink is not defined'));
  });
});
