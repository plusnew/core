import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew, { component, store } from "../../../index";
import type { Props } from "../../../index";

async function tick(count: number) {
  for (let i = 0; i < count; i += 1) {
    await new Promise<void>((resolve) => resolve());
  }
}

describe("rendering the elements", () => {
  const local = store(
    0,
    (previousState, _action: undefined) => previousState + 1
  );
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("check if element is inserted", () => {
    const Component = component("Component", (_Props: Props<{}>) => (
      <div class="foo" />
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.className).toBe("foo");
  });

  it("check if elements are inserted", () => {
    const Component = component("Component", () => (
      <div>
        <div class="foo" />
        <span class="bar" />
      </div>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes[0].childNodes.length).toBe(2);

    const firstTarget = container.childNodes[0].childNodes[0] as HTMLElement;
    expect(firstTarget.nodeName).toBe("DIV");
    expect(firstTarget.className).toBe("foo");

    const secondTarget = container.childNodes[0].childNodes[1] as HTMLElement;
    expect(secondTarget.nodeName).toBe("SPAN");
    expect(secondTarget.className).toBe("bar");
  });

  it("check if nesting works", () => {
    const Component = component("Component", () => (
      <div class="foo">
        <span class="bar" />
      </div>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.className).toBe("foo");
    expect(target.innerHTML).toBe('<span class="bar"></span>');
  });

  it("check if textnode is created on root", () => {
    const Component = component("Component", () => "foo");

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe("foo");
  });

  it("check if textnode is created on root, even with number", () => {
    const Component = component("Component", () => 1);

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe("1");
  });

  it("check if textnode is created", () => {
    const Component = component("Component", (_Props: Props<{}>) => (
      <div class="foo">bar</div>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.className).toBe("foo");
    expect(target.innerHTML).toBe("bar");
  });

  it("check if null is created on root", () => {
    const Component = component("Component", () => null);
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it("check if undefined is created on root", () => {
    const Component = component("Component", () => undefined);

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(0);
  });

  it("check if true is created on root", () => {
    const Component = component("Component", () => true as any);

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it("check if false is created on root", () => {
    const Component = component("Component", () => false as any);

    plusnew.render(<Component />, { driver: driver(container) });
    expect(container.childNodes.length).toBe(0);
    local.dispatch(undefined);
  });

  it("adding element afterwards", () => {
    const local = store(false);

    const MainComponent = component("Component", () => (
      <>
        <header />
        <local.Observer>
          {(localState) => localState && <content />}
        </local.Observer>
        <footer />
      </>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("HEADER");
    expect((container.childNodes[1] as HTMLElement).tagName).toBe("FOOTER");

    local.dispatch(true);

    expect(container.childNodes.length).toBe(3);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("HEADER");
    expect((container.childNodes[1] as HTMLElement).tagName).toBe("CONTENT");
    expect((container.childNodes[2] as HTMLElement).tagName).toBe("FOOTER");
  });

  it("removing element afterwards", () => {
    const local = store(true);

    const MainComponent = component("Component", () => (
      <local.Observer>
        {(localState) =>
          localState ? (
            <ul>
              <li />
              <li />
            </ul>
          ) : (
            <ul>
              <li />
            </ul>
          )
        }
      </local.Observer>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    const target = container.childNodes[0];

    expect(target.childNodes.length).toBe(2);
    expect((target.childNodes[0] as HTMLElement).tagName).toBe("LI");
    expect((target.childNodes[1] as HTMLElement).tagName).toBe("LI");

    local.dispatch(false);

    expect(target.childNodes.length).toBe(1);
    expect((target.childNodes[0] as HTMLElement).tagName).toBe("LI");
  });

  it("removing element asynchronisly", async () => {
    const local = store(true);

    const elementWillUnmountSpy = jasmine
      .createSpy("elementWillUnmountSpy", (element: Element) => {
        expect(container.childNodes[0] as HTMLElement).toBe(element);
        return Promise.resolve();
      })
      .and.callThrough();

    const MainComponent = component(
      "Component",
      (_Props, componentInstance) => {
        componentInstance.elementWillUnmount = elementWillUnmountSpy;

        return (
          <local.Observer>
            {(localState) => localState && <div />}
          </local.Observer>
        );
      }
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(elementWillUnmountSpy).not.toHaveBeenCalled();

    local.dispatch(false);

    expect(container.childNodes.length).toBe(1);
    expect(elementWillUnmountSpy).toHaveBeenCalled();

    await tick(1);

    expect(container.childNodes.length).toBe(0);
  });

  it("removing nested element asynchronisly", async () => {
    const local = store(true);

    const elementWillUnmountSpy = jasmine
      .createSpy("elementWillUnmountSpy", (element: Element) => {
        expect(container.childNodes[0].childNodes[0] as HTMLElement).toBe(
          element
        );
        return Promise.resolve();
      })
      .and.callThrough();

    const MainComponent = component("Component", (_Props) => (
      <local.Observer>
        {(localState) =>
          localState && (
            <div>
              <>
                <NestedComponent />
              </>
            </div>
          )
        }
      </local.Observer>
    ));

    const NestedComponent = component(
      "Component",
      (_Props, componentInstance) => {
        componentInstance.elementWillUnmount = elementWillUnmountSpy;

        return <div />;
      }
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(elementWillUnmountSpy).not.toHaveBeenCalled();

    local.dispatch(false);

    expect(container.childNodes.length).toBe(0);
    expect(elementWillUnmountSpy).toHaveBeenCalled();

    await tick(1);

    expect(container.childNodes.length).toBe(0);
  });

  it("removing multiple elements asynchronisly", async () => {
    const local = store(true);

    const elementWillUnmountSpy = jasmine
      .createSpy("elementWillUnmountSpy", (element: Element) => {
        expect(
          container.childNodes[
            elementWillUnmountSpy.calls.count() - 1
          ] as HTMLElement
        ).toBe(element);
        return Promise.resolve();
      })
      .and.callThrough();

    const MainComponent = component(
      "Component",
      (_Props, componentInstance) => {
        componentInstance.elementWillUnmount = elementWillUnmountSpy;

        return (
          <local.Observer>
            {(localState) => localState && [<div />, <div />]}
          </local.Observer>
        );
      }
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(elementWillUnmountSpy).not.toHaveBeenCalled();

    local.dispatch(false);

    expect(container.childNodes.length).toBe(2);
    expect(elementWillUnmountSpy).toHaveBeenCalled();

    await tick(1);

    expect(container.childNodes.length).toBe(0);
  });

  it("nested elements should not be triggering a remove", () => {
    const local = store(true);
    const clickSpy = jasmine.createSpy("clickspy");

    const MainComponent = component("Component", () => (
      <local.Observer>
        {(localState) => (
          <div>
            {localState && (
              <picture>
                <source src="bar" />
                <img src="foo" onclick={clickSpy} />
              </picture>
            )}
          </div>
        )}
      </local.Observer>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const divContainer = container.childNodes[0] as HTMLElement;
    expect(divContainer.childNodes.length).toBe(1);
    expect(divContainer.childNodes[0].childNodes.length).toBe(2);

    const imgElement = divContainer.childNodes[0].childNodes[1];
    const sourceElementRemoveSpy = spyOn(
      divContainer.childNodes[0].childNodes[0],
      "remove"
    );
    const imgElementRemoveSpy = spyOn(imgElement, "remove");

    local.dispatch(false);

    expect(divContainer.innerHTML).toBe("");
    expect(container.childNodes.length).toBe(1);
    expect(divContainer.childNodes.length).toBe(0);
    expect(sourceElementRemoveSpy).not.toHaveBeenCalled();
    expect(imgElementRemoveSpy).not.toHaveBeenCalled();

    imgElement.dispatchEvent(new Event("click"));

    expect(clickSpy).not.toHaveBeenCalled();
  });
});
