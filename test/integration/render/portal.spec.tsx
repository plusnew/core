import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew, { component, PortalEntrance, PortalExit } from "../../../index";

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
});
