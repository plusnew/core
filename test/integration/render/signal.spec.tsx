import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import { signal } from "@preact/signals-core";
import type { Props } from "../../../index";
import plusnew, { component, context, store, Try, Async } from "../../../index";

async function tick(count: number) {
  for (let i = 0; i < count; i += 1) {
    await new Promise<void>((resolve) => resolve());
  }
}

describe("updating for signals", () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("for plain component", () => {
    it("updating signal updates dom", () => {
      const counter = signal(0);
      const Component = component("Component", (_Props: Props<{}>) => (
        <div>{counter.value}</div>
      ));

      plusnew.render(<Component />, {
        driver: driver(container),
      });

      expect(container.childNodes.length).toBe(1);
      const target = container.childNodes[0] as HTMLElement;
      expect(target.nodeName).toBe("DIV");
      expect(target.textContent).toBe("0");

      counter.value = 1;

      expect(target.textContent).toBe("1");
    });
  });

  describe("for observer", () => {
    it("updating signal updates dom, updating store keeps signal observers alive", () => {
      const wrapper = store(true);
      const first = signal(0);
      const second = signal("foo");

      const wrapperRender = jest.fn((wrapperState: boolean) => (
        <div>{wrapperState ? first.value : second.value}</div>
      ));

      const Component = component("Component", (_Props: Props<{}>) => (
        <wrapper.Observer>{wrapperRender}</wrapper.Observer>
      ));
      const instance = plusnew.render(<Component />, {
        driver: driver(container),
      });

      expect(container.childNodes.length).toBe(1);
      const target = container.childNodes[0] as HTMLElement;
      expect(target.nodeName).toBe("DIV");
      expect(target.textContent).toBe("0");
      expect(wrapperRender).toHaveBeenCalledTimes(1);

      first.value = 1;

      expect(target.textContent).toBe("1");
      expect(wrapperRender).toHaveBeenCalledTimes(2);

      wrapper.dispatch(false);

      expect(target.textContent).toBe("foo");
      expect(wrapperRender).toHaveBeenCalledTimes(3);

      second.value = "bar";

      expect(target.textContent).toBe("bar");
      expect(wrapperRender).toHaveBeenCalledTimes(4);

      first.value = 1;

      expect(wrapperRender).toHaveBeenCalledTimes(4);

      instance.remove(false);
      second.value = "baz";

      expect(target.textContent).not.toBe("baz");
      expect(wrapperRender).toHaveBeenCalledTimes(4);
    });
  });

  describe("for context", () => {
    it("updating signal updates dom, updating store keeps signal observers alive", () => {
      const wrapperContext = context<boolean, never>();
      const wrapper = store(true);
      const first = signal(0);
      const second = signal("foo");

      const wrapperRender = jest.fn((wrapperState: boolean) => (
        <div>{wrapperState ? first.value : second.value}</div>
      ));

      const MainComponent = component("MainComponent", (_Props: Props<{}>) => (
        <wrapper.Observer>
          {(wrapperState) => (
            <wrapperContext.Provider state={wrapperState} dispatch={() => null}>
              <NestedComponent />
            </wrapperContext.Provider>
          )}
        </wrapper.Observer>
      ));
      const NestedComponent = component(
        "NestedComponent",
        (_Props: Props<{}>) => (
          <wrapperContext.Consumer>{wrapperRender}</wrapperContext.Consumer>
        )
      );
      const instance = plusnew.render(<MainComponent />, {
        driver: driver(container),
      });

      expect(container.childNodes.length).toBe(1);
      const target = container.childNodes[0] as HTMLElement;
      expect(target.nodeName).toBe("DIV");
      expect(target.textContent).toBe("0");
      expect(wrapperRender).toHaveBeenCalledTimes(1);

      first.value = 1;

      expect(target.textContent).toBe("1");
      expect(wrapperRender).toHaveBeenCalledTimes(2);

      wrapper.dispatch(false);

      expect(target.textContent).toBe("foo");
      expect(wrapperRender).toHaveBeenCalledTimes(3);

      second.value = "bar";

      expect(target.textContent).toBe("bar");
      expect(wrapperRender).toHaveBeenCalledTimes(4);

      first.value = 1;

      expect(wrapperRender).toHaveBeenCalledTimes(4);

      instance.remove(false);
      second.value = "baz";

      expect(target.textContent).not.toBe("baz");
      expect(wrapperRender).toHaveBeenCalledTimes(4);
    });
  });

  xit("updating signal, updates the dom in try", () => {
    const counter = signal(0);

    const Component = component("Component", (_Props: Props<{}>) => (
      <Try catch={() => null}>{() => <div>{counter.value}</div>}</Try>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.textContent).toBe("0");

    counter.value = 1;

    expect(target.textContent).toBe("1");
  });

  describe("for async", () => {
    it("show resolved promise", async () => {
      const signalValue = signal(0);
      const Component = component("Component", () => (
        <Async
          pendingIndicator={<span>{signalValue.value}</span>}
          constructor={() => new Promise<string>((resolve) => resolve("foo"))}
        >
          {(value) => (
            <div>
              {value}
              {signalValue.value}
            </div>
          )}
        </Async>
      ));

      plusnew.render(<Component />, { driver: driver(container) });

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");
      expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("0");

      signalValue.value = 1;

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");
      expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1");

      await tick(1);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
      expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("foo1");

      signalValue.value = 2;

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
      expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("foo2");
    });
  });

  it("show resolved promise", async () => {
    const signalValue = signal(0);
    const Component = component("Component", () => (
      <Async
        pendingIndicator={<span />}
        constructor={() => new Promise<string>((resolve) => resolve("foo"))}
      >
        {(value) => (
          <div>
            {value}
            {signalValue.value}
          </div>
        )}
      </Async>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    await tick(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("foo0");

    signalValue.value = 1;

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("foo1");
  });
});
