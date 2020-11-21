import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew, { Async, component, store, Try } from "../../../index";
import ComponentInstance from "../../../src/instances/types/Component/Instance";

async function tick(count: number) {
  for (let i = 0; i < count; i += 1) {
    await new Promise<void>((resolve) => resolve());
  }
}

describe("<Async />", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
  });

  it("show loading when promise is not resolved yet and then show resolved promise", async () => {
    const Component = component("Component", () => (
      <Async
        pendingIndicator={<span />}
        constructor={() => new Promise<string>((resolve) => resolve("foo"))}
      >
        {(value) => <div>{value}</div>}
      </Async>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
  });

  it("show loading when promise is not resolved yet and then show resolved promise, with invokeguard", async () => {
    const Component = component("Component", () => (
      <Try catch={() => <h1 />}>
        {() => (
          <Async
            pendingIndicator={<span />}
            constructor={() => new Promise<string>((resolve) => resolve("foo"))}
          >
            {(value) => <div>{value}</div>}
          </Async>
        )}
      </Try>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
  });

  it("show resolved promise", async () => {
    const Component = component("Component", () => (
      <Async
        pendingIndicator={<span />}
        constructor={() => new Promise<string>((resolve) => resolve("foo"))}
      >
        {(value) => <div>{value}</div>}
      </Async>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("foo");
  });

  it("change promise with props", async () => {
    const local = store(0, (_state, action: number) => action);
    const constructorSpy = jest.fn(
      () => new Promise<string>((resolve) => resolve("foo"))
    );

    const Component = component("Component", () => (
      <local.Observer>
        {(state) => (
          <Async pendingIndicator={<span />} constructor={constructorSpy}>
            {(value) => <div>{`${state}-${value}`}</div>}
          </Async>
        )}
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    await tick(1);

    const element = container.childNodes[0] as HTMLElement;
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("0-foo");

    local.dispatch(1);

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1-foo");
    expect(container.childNodes[0] as HTMLElement).toBe(element);
    expect(constructorSpy).toHaveBeenCalledTimes(1);
  });

  it("change pending indicator", async () => {
    const local = store(0, (_state, action: number) => action);
    const constructorSpy = jest.fn(
      () => new Promise<string>((resolve) => resolve("foo"))
    );

    const Component = component("Component", () => (
      <local.Observer>
        {(state) => (
          <Async
            pendingIndicator={<span>{state}</span>}
            constructor={constructorSpy}
          >
            {(value) => <div>{`${state}-${value}`}</div>}
          </Async>
        )}
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("0");

    local.dispatch(1);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1");

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1-foo");
    expect(constructorSpy).toHaveBeenCalledTimes(1);
  });

  it("discard promise resolve, when a new one was given", async () => {
    const local = store(0, (_state, action: number) => action);

    const Component = component("Component", () => (
      <local.Observer>
        {(state) => (
          <Async
            key={state}
            pendingIndicator={<span />}
            constructor={async () => {
              if (state === 0) {
                await tick(2);
                return "old";
              }
              return "new";
            }}
          >
            {(value) => <div>{value}</div>}
          </Async>
        )}
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    local.dispatch(1);

    await tick(1);

    const element = container.childNodes[0] as HTMLElement;
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("new");

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("new");
    expect(container.childNodes[0] as HTMLElement).toBe(element);
  });

  it("remove async component", async () => {
    const throwNotMountedErrorSpy = spyOn(
      ComponentInstance.prototype,
      "throwNotMountedError" as any
    ).and.callThrough();
    const local = store(true, (_state, action: boolean) => action);

    const Component = component("Component", () => (
      <local.Observer>
        {(state) =>
          state === true && (
            <Async
              pendingIndicator={<span />}
              constructor={() =>
                new Promise<string>((resolve) => resolve("foo"))
              }
            >
              {(value) => <div>{value}</div>}
            </Async>
          )
        }
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");
    local.dispatch(false);
    expect(container.childNodes.length).toBe(0);

    await tick(1);

    expect(container.childNodes.length).toBe(0);
    expect(throwNotMountedErrorSpy).not.toHaveBeenCalled();
  });

  it("addAsyncListener sends promise for pending state", async () => {
    const promise = new Promise((resolve) => setTimeout(resolve));

    const Component = component("Component", () => (
      <Async
        pendingIndicator={<span />}
        constructor={async () => {
          await promise;
          return "foo";
        }}
      >
        {(value) => <div>{value}</div>}
      </Async>
    ));

    let asyncPromise;

    plusnew.render(<Component />, {
      driver: driver(container),
      addAsyncListener: (promise) => (asyncPromise = promise),
    });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    await asyncPromise;

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
  });

  it("addAsyncListener sends promise for pending state, works even with resolved promise", async () => {
    const promise = Promise.resolve();

    const Component = component("Component", () => (
      <Async
        pendingIndicator={<span />}
        constructor={async () => {
          await promise;
          return "foo";
        }}
      >
        {(value) => <div>{value}</div>}
      </Async>
    ));

    let asyncPromise;

    plusnew.render(<Component />, {
      driver: driver(container),
      addAsyncListener: (promise) => (asyncPromise = promise),
    });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    await asyncPromise;

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
  });

  it("When promise gets rejected, the exception will bubble to the try component", async () => {
    const Component = component("Component", () => (
      <Try catch={(reason: any) => <div>{reason}</div>}>
        {() => (
          <Async
            pendingIndicator={<span />}
            constructor={() => Promise.reject("foo")}
          >
            {(_value) => <h1 />}
          </Async>
        )}
      </Try>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    await tick(1);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("foo");
  });

  // Rethrowing promise rejection seems to be impossible to test in jest, since the original `process` is mocked
  xit("When promise gets rejected, the exception will be unhandled and a unhandledrejection should be raised", async () => {
    const unhandledrejectionSpy = jest.fn();
    window.addEventListener("unhandledrejection", unhandledrejectionSpy);

    const Component = component("Component", () => (
      <Async
        pendingIndicator={<span />}
        constructor={() => Promise.reject("foo")}
      >
        {(_value) => <h1 />}
      </Async>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");

    await tick(5);

    // @TODO Jest doesn't let me do it like that, i have to figure out how to do it instead
    // expect(unhandledrejectionSpy).toHaveBeenCalledTimes(1);
    // expect(unhandledrejectionSpy).toHaveBeenCalledWith("foo");

    window.removeEventListener("unhandledrejection", unhandledrejectionSpy);
  });
});
