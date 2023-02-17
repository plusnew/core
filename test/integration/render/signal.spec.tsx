import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import { signal } from "@preact/signals-core";
import type { Props } from "../../../index";
import plusnew, { component, context, store, Try } from "../../../index";

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

  it("updating signal, updates the dom in plain component", () => {
    const counter = signal(0);
    const Component = component("Component", (_Props: Props<{}>) => (
      <div>{counter.value}</div>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.textContent).toBe("0");

    counter.value = 1;

    expect(target.textContent).toBe("1");
  });

  it("updating signal, updates the dom in store", () => {
    const wrapper = store("");
    const counter = signal(0);

    const Component = component("Component", (_Props: Props<{}>) => (
      <wrapper.Observer>{() => <div>{counter.value}</div>}</wrapper.Observer>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.textContent).toBe("0");

    counter.value = 1;

    expect(target.textContent).toBe("1");
  });

  it("updating signal, updates the dom in consumer", () => {
    const wrapper = context<string, never>();
    const counter = signal(0);

    const Component = component("Component", (_Props: Props<{}>) => (
      <wrapper.Provider state="" dispatch={() => null}>
        <wrapper.Consumer>{() => <div>{counter.value}</div>}</wrapper.Consumer>
      </wrapper.Provider>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.textContent).toBe("0");

    counter.value = 1;

    expect(target.textContent).toBe("1");
  });

  it("updating signal, updates the dom in try", () => {
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
});
