import driver from '@plusnew/driver-dom/src/driver';
import plusnew, { component, PortalEntrance, PortalExit } from '../../../index';

const htmlNamespace = 'http://www.w3.org/1999/xhtml';
const svgNamespace = 'http://www.w3.org/2000/svg';

describe('rendering portals in svg components', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = 'lots of stuff';
    document.body.appendChild(container);
  });

  it('check if div element has correct namespace', () => {
    const Component = component(
      'Component',
      () =>
        <span>
          <PortalExit name="foo" />
          <svg>
            <PortalEntrance name="foo">
              <div />
            </PortalEntrance>
          </svg>
        </span>,
    );

    plusnew.render(<Component />, { driver: driver(container) });

    const target = container.childNodes[0];
    expect(target.childNodes[0].namespaceURI).toBe(htmlNamespace);
    expect(target.childNodes[1].namespaceURI).toBe(svgNamespace);
  });

});
