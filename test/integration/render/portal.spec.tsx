import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew, {
  component,
  PortalEntrance,
  PortalExit,
  store,
} from "../../../index";

const htmlNamespace = "http://www.w3.org/1999/xhtml";
const svgNamespace = "http://www.w3.org/2000/svg";

describe("rendering nested Portals", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
  });

  it("does a PortalEntrance and a PortalExit work", () => {
    const Component = component("Component", () => (
      <>
        <div>
          <PortalExit name="foo" />
        </div>
        <div>
          <PortalEntrance name="foo">
            <span />
          </PortalEntrance>
        </div>
      </>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    const portalExit = container.childNodes[0] as HTMLElement;
    const portalEntrance = container.childNodes[1] as HTMLElement;

    expect(container.childNodes.length).toBe(2);

    expect(portalExit.tagName).toBe("DIV");
    expect(portalExit.childNodes.length).toBe(1);
    expect((portalExit.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    expect(portalEntrance.tagName).toBe("DIV");
    expect(portalEntrance.childNodes.length).toBe(0);
  });

  it("when PortalExit gets unmounted, the PortalEntrance should not be usable", () => {
    const local = store(true);
    const Component = component("Component", () => (
      <>
        <div>
          <local.Observer>
            {(localState) => localState && <PortalExit name="foo" />}
          </local.Observer>
        </div>
        <div>
          <local.Observer>
            {(localState) =>
              localState === false && (
                <PortalEntrance name="foo">
                  <span />
                </PortalEntrance>
              )
            }
          </local.Observer>
        </div>
      </>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(() => local.dispatch(false)).toThrow(
      new Error("Could not find PortalExit with name foo")
    );
  });

  it("does a PortalEntrance and a PortalExit work with renderoptions", () => {
    const Component = component("Component", () => (
      <>
        <div>
          <PortalExit name="foo" />
        </div>
        <div>
          <PortalEntrance name="foo">
            <span />
          </PortalEntrance>
        </div>
      </>
    ));

    plusnew.render(<Component />, { driver: driver(container), portals: {} });

    const portalExit = container.childNodes[0] as HTMLElement;
    const portalEntrance = container.childNodes[1] as HTMLElement;

    expect(container.childNodes.length).toBe(2);

    expect(portalExit.tagName).toBe("DIV");
    expect(portalExit.childNodes.length).toBe(1);
    expect((portalExit.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    expect(portalEntrance.tagName).toBe("DIV");
    expect(portalEntrance.childNodes.length).toBe(0);
  });

  it("a PortalEntrance and a wrong PortalExit work", () => {
    const Component = component("Component", () => (
      <>
        <div>
          <PortalExit name="foo" />
        </div>
        <div>
          <PortalEntrance name="bar">
            <span />
          </PortalEntrance>
        </div>
      </>
    ));

    expect(() =>
      plusnew.render(<Component />, { driver: driver(container) })
    ).toThrow(new Error("Could not find PortalExit with name bar"));
  });

  it("a PortalEntrance and no PortalExitk", () => {
    const Component = component("Component", () => (
      <div>
        <PortalEntrance name="bar">
          <span />
        </PortalEntrance>
      </div>
    ));

    expect(() =>
      plusnew.render(<Component />, { driver: driver(container) })
    ).toThrow(new Error("Could not find PortalExit with name bar"));
  });

  it("two portalExits with the same name", () => {
    const Component = component("Component", () => (
      <div>
        <PortalExit name="foo" />
        <PortalExit name="foo" />
      </div>
    ));

    expect(() =>
      plusnew.render(<Component />, { driver: driver(container) })
    ).toThrow(
      new Error("Could not create a PortalExit with the same name foo")
    );
  });

  it("check if div element has correct namespace", () => {
    const Component = component("Component", () => (
      <span>
        <PortalExit name="foo" />
        <svg>
          <PortalEntrance name="foo">
            <div />
          </PortalEntrance>
        </svg>
      </span>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    const target = container.childNodes[0];
    expect(target.childNodes[0].namespaceURI).toBe(htmlNamespace);
    expect(target.childNodes[1].namespaceURI).toBe(svgNamespace);
  });

  it("does environment changing PortalEntrance work", () => {
    const toggle = store(true);

    const Component = component("Component", () => (
      <toggle.Observer>
        {(toggleState) => (
          <>
            <div>
              <PortalExit name="foo" />
            </div>
            {toggleState ? (
              <div>
                <svg />
                <PortalEntrance name="foo">
                  <span />
                </PortalEntrance>
              </div>
            ) : (
              <div>
                <PortalEntrance name="foo">
                  <span />
                </PortalEntrance>
                <svg />
              </div>
            )}
          </>
        )}
      </toggle.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    const portalExit = container.childNodes[0] as HTMLElement;
    const portalEntrance = container.childNodes[1] as HTMLElement;

    expect(container.childNodes.length).toBe(2);

    expect(portalExit.tagName).toBe("DIV");
    expect(portalExit.childNodes.length).toBe(1);
    expect((portalExit.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    expect(portalEntrance.tagName).toBe("DIV");
    expect(portalEntrance.childNodes.length).toBe(1);
    expect((portalEntrance.childNodes[0] as SVGElement).tagName).toBe("svg");

    toggle.dispatch(false);

    expect(portalExit.tagName).toBe("DIV");
    expect(portalExit.childNodes.length).toBe(1);
    expect((portalExit.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    expect(portalEntrance.tagName).toBe("DIV");
    expect(portalEntrance.childNodes.length).toBe(1);
    expect((portalEntrance.childNodes[0] as SVGElement).tagName).toBe("svg");

    toggle.dispatch(true);

    expect(portalExit.tagName).toBe("DIV");
    expect(portalExit.childNodes.length).toBe(1);
    expect((portalExit.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    expect(portalEntrance.tagName).toBe("DIV");
    expect(portalEntrance.childNodes.length).toBe(1);
    expect((portalEntrance.childNodes[0] as SVGElement).tagName).toBe("svg");
  });
});
