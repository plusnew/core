import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew, { component, context, store } from "../../../index";
import type { Props } from "../../../index";

describe("context", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
  });

  it("container element uses provider and nested component consumes it", () => {
    const valueContext = context<number, number>();
    const valueStore = store(1, (state, action: number) => state + action);

    const MainComponent = component("Component", () => (
      <valueStore.Observer>
        {(valueState) => (
          <valueContext.Provider
            state={valueState}
            dispatch={valueStore.dispatch}
          >
            <NestedComponent />
          </valueContext.Provider>
        )}
      </valueStore.Observer>
    ));

    const NestedComponent = component("Component", () => (
      <valueContext.Consumer>{(state) => state}</valueContext.Consumer>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe("1");
  });

  it("when a store updates, the consumer should update", () => {
    const valueContext = context<number, number>();
    const valueStore = store(1, (state, action: number) => state + action);

    const MainComponent = component("Component", () => (
      <valueStore.Observer>
        {(valueState) => (
          <valueContext.Provider
            state={valueState}
            dispatch={valueStore.dispatch}
          >
            <NestedComponent />
          </valueContext.Provider>
        )}
      </valueStore.Observer>
    ));

    const NestedComponent = component("Component", () => (
      <valueContext.Consumer>{(state) => state}</valueContext.Consumer>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe("1");

    valueStore.dispatch(2);

    expect(container.childNodes.length).toBe(1);
    expect(container.innerHTML).toBe("3");
  });

  it("two nested consumers are using the state, one is dispatching a value and both consumers get updated", () => {
    const valueContext = context<number, number>();
    const valueStore = store(1, (state, action: number) => state + action);

    const MainComponent = component("Component", () => (
      <valueStore.Observer>
        {(valueState) => (
          <valueContext.Provider
            state={valueState}
            dispatch={valueStore.dispatch}
          >
            <NestedComponent />
            <AnotherNestedComponent />
          </valueContext.Provider>
        )}
      </valueStore.Observer>
    ));

    const NestedComponent = component("Component", () => (
      <div>
        <valueContext.Consumer>{(state) => state}</valueContext.Consumer>
      </div>
    ));

    const AnotherNestedComponent = component("Component", () => (
      <valueContext.Consumer>
        {(state, dispatch) => (
          <button onclick={() => dispatch(2)}>{state}</button>
        )}
      </valueContext.Consumer>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1");
    expect((container.childNodes[1] as HTMLElement).tagName).toBe("BUTTON");
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe("1");

    (container.childNodes[1] as HTMLElement).dispatchEvent(new Event("click"));

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("3");
    expect((container.childNodes[1] as HTMLElement).tagName).toBe("BUTTON");
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe("3");
  });

  it("two nested consumers are using the state, one is dispatching a value and both consumers get updated", () => {
    const valueContext = context<number, number>();
    const valueStore = store(1);

    const MainComponent = component("Component", () => (
      <valueStore.Observer>
        {(valueState) => (
          <valueContext.Provider
            state={valueState}
            dispatch={valueStore.dispatch}
          >
            <NestedComponent />
            <AnotherNestedComponent />
          </valueContext.Provider>
        )}
      </valueStore.Observer>
    ));

    const NestedComponent = component("Component", () => (
      <div>
        <valueContext.Consumer>{(state) => state}</valueContext.Consumer>
      </div>
    ));

    const AnotherNestedComponent = component("Component", () => (
      <valueContext.Consumer>
        {(state, dispatch) => (
          <button onclick={() => dispatch(2)}>{state}</button>
        )}
      </valueContext.Consumer>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1");
    expect((container.childNodes[1] as HTMLElement).tagName).toBe("BUTTON");
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe("1");

    (container.childNodes[1] as HTMLElement).dispatchEvent(new Event("click"));

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("2");
    expect((container.childNodes[1] as HTMLElement).tagName).toBe("BUTTON");
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe("2");
  });

  it("a component tries to use a consumer without a provider, an exception is expected", () => {
    const valueContext = context<number, number>();

    const MainComponent = component("Component", () => <NestedComponent />);

    const NestedComponent = component("Component", () => (
      <valueContext.Consumer>{(state) => state}</valueContext.Consumer>
    ));

    expect(() =>
      plusnew.render(<MainComponent />, { driver: driver(container) })
    ).toThrow(new Error("Could not find Provider"));
  });

  it("a component tries to use a consumer with a wrong provider, an exception is expected", () => {
    const valueContext = context<number, number>();
    const anotherContext = context<number, number>();

    const MainComponent = component("Component", () => (
      <anotherContext.Provider state={1} dispatch={() => true}>
        <NestedComponent />
      </anotherContext.Provider>
    ));

    const NestedComponent = component("Component", () => (
      <valueContext.Consumer>{(state) => state}</valueContext.Consumer>
    ));

    expect(() =>
      plusnew.render(<MainComponent />, { driver: driver(container) })
    ).toThrow(new Error("Could not find Provider"));
  });

  it("a consumer can get unmounted and doesnt crash", () => {
    const local = store(true);
    const valueContext = context<number, number>();
    const valueStore = store(1);

    const MainComponent = component("Component", () => (
      <valueStore.Observer>
        {(valueState) => (
          <valueContext.Provider
            state={valueState}
            dispatch={valueStore.dispatch}
          >
            <local.Observer>
              {(localState) => localState === true && <NestedComponent />}
            </local.Observer>
            <AnotherNestedComponent />
          </valueContext.Provider>
        )}
      </valueStore.Observer>
    ));

    const NestedComponent = component("Component", () => (
      <div>
        <valueContext.Consumer>{(state) => state}</valueContext.Consumer>
      </div>
    ));

    const AnotherNestedComponent = component("Component", () => (
      <valueContext.Consumer>
        {(state, dispatch) => (
          <button onclick={() => dispatch(2)}>{state}</button>
        )}
      </valueContext.Consumer>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(2);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1");
    expect((container.childNodes[1] as HTMLElement).tagName).toBe("BUTTON");
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe("1");

    local.dispatch(false);

    expect(container.childNodes.length).toBe(1);

    (container.childNodes[0] as HTMLElement).dispatchEvent(new Event("click"));

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("BUTTON");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("2");
  });

  it("a component tries to use a consumer with a wrong provider, an exception is expected", () => {
    const valueContext = context<number, number>();
    const local = store(1);

    const MainComponent = component("Component", () => (
      <valueContext.Provider state={1} dispatch={() => true}>
        <local.Observer>
          {(localState) => <NestedComponent value={localState} />}
        </local.Observer>
      </valueContext.Provider>
    ));

    const NestedComponent = component(
      "Component",
      (Props: Props<{ value: number }>) => (
        <Props>
          {(props) => (
            <valueContext.Consumer>
              {(state) => <div>{state + props.value}</div>}
            </valueContext.Consumer>
          )}
        </Props>
      )
    );

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("2");

    local.dispatch(2);

    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("3");
  });

  it("findProvider works", () => {
    const valueStore = store(0);
    const valueContext = context<number, number>();

    const NestedComponent = component(
      "Component",
      (_Props, componentInstance) => {
        const { state, dispatch } = valueContext.findProvider(
          componentInstance
        );

        return <span onclick={() => dispatch(state + 1)}>{state}</span>;
      }
    );

    const MainComponent = component("Component", () => (
      <valueStore.Observer>
        {(valueState) => (
          <valueContext.Provider
            state={valueState}
            dispatch={valueStore.dispatch}
          >
            <NestedComponent />
          </valueContext.Provider>
        )}
      </valueStore.Observer>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("0");

    (container.childNodes[0] as HTMLElement).dispatchEvent(new Event("click"));

    expect(valueStore.getState()).toBe(1);
  });
});
