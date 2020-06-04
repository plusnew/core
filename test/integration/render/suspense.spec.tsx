import type { Suspense } from "@plusnew/core/src/interfaces/suspense";
import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew, { component, Component, Props } from "../../../index";
import { Suspense as SuspenseSymbol } from "../../../src/util/symbols";

function tick() {
  return Promise.resolve();
}

describe("<Suspense />", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
  });

  it("Show nothing when promise is not resolved, then show result", async () => {
    const Component = component("Component", () => Promise.resolve("foo"));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(0);

    await tick();

    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].nodeName).toBe("#text");
    expect((container.childNodes[0] as Text).textContent).toBe("foo");
  });

  it("Call suspense when promise got mounted", async () => {
    const addPromiseSpy = jest.fn();
    class SuspenseMock extends Component<{ children: any }>
      implements Suspense {
      identifier = SuspenseSymbol;
      addPromise() {
        return addPromiseSpy();
      }

      removePromise() {
        return null;
      }

      render(Props: Props<{ children: any }>) {
        return <Props>{(props) => props.children}</Props>;
      }
    }

    const promise = Promise.resolve("foo");
    const MainComponent = component("Component", () => promise);

    plusnew.render(
      <SuspenseMock>
        <MainComponent />
      </SuspenseMock>,
      { driver: driver(container) }
    );

    expect(container.childNodes.length).toBe(0);
    expect(addPromiseSpy).toHaveBeenCalledTimes(1);
    expect(addPromiseSpy).toHaveBeenCalledWith(promise);

    await tick();

    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].nodeName).toBe("#text");
    expect((container.childNodes[0] as Text).textContent).toBe("foo");
  });
});
