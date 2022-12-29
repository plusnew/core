import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import TextInstance from "../../../src/instances/types/Text/Instance";
import plusnew, { component, store } from "../../../index";
import type { Store } from "../../../index";

describe("rendering the elements", () => {
  let container: HTMLElement;
  let local: Store<string, string>;
  let setTextSpy: jest.SpyInstance;
  beforeEach(() => {
    local = store(
      "foo",
      (_previousState: string, newValue: string) => newValue
    );

    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
    if (setTextSpy) {
      setTextSpy.mockRestore();
    }

    setTextSpy = jest.spyOn(TextInstance.prototype, "setText");
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("does a value change with store", () => {
    const Component = component("Component", () => (
      <local.Observer>
        {(state) => <div class={state}>{state}</div>}
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    const textElement = target.childNodes[0] as Text;

    expect(target.nodeName).toBe("DIV");
    expect(target.className).toBe("foo");
    expect(target.innerHTML).toBe("foo");
    expect(textElement.textContent).toBe("foo");

    local.dispatch("bar");

    expect(target.className).toBe("bar");
    expect(target.innerHTML).toBe("bar");
    expect(textElement).toBe(textElement);
  });

  it("with the same values, all objects should be the same", () => {
    const Component = component("Component", () => (
      <local.Observer>
        {(state) => <div class={state}>{state}</div>}
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    const textElement = target.childNodes[0] as Text;

    expect(target.nodeName).toBe("DIV");
    expect(target.className).toBe("foo");
    expect(textElement.textContent).toBe("foo");

    local.dispatch("foo");

    expect(target.className).toBe("foo");
    expect(target.innerHTML).toBe("foo");
    expect(textElement).toBe(textElement);
  });

  it("does a value change with store with JSX.Element to string", () => {
    const Component = component("Component", () => (
      <local.Observer>
        {(state) =>
          state === "foo" ? (
            <div>
              <span>{state}</span>
            </div>
          ) : (
            <div>{state}</div>
          )
        }
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.childNodes[0].nodeName).toBe("SPAN");
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe("foo");

    local.dispatch("bar");

    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("bar");
  });

  it("does a value change with store with string to JSX.Element", () => {
    const Component = component("Component", () => (
      <local.Observer>
        {(state) =>
          state === "foo" ? (
            <div>{state}</div>
          ) : (
            <div>
              <span>{state}</span>
            </div>
          )
        }
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("foo");

    local.dispatch("bar");

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.childNodes[0].nodeName).toBe("SPAN");
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe("bar");
  });

  it("does a value change with store with string to JSX.Element[]", () => {
    const Component = component("Component", () => (
      <local.Observer>
        {(state) =>
          state === "foo" ? (
            <span>{state}</span>
          ) : (
            <span>
              <div>{state}</div>
              <span>{state}</span>
            </span>
          )
        }
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("foo");

    local.dispatch("bar");

    expect(container.childNodes[0].childNodes.length).toBe(2);
    const target = container.childNodes[0].childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.innerHTML).toBe("bar");

    const targetSecond = container.childNodes[0].childNodes[1] as HTMLElement;
    expect(targetSecond.nodeName).toBe("SPAN");
    expect(targetSecond.innerHTML).toBe("bar");
  });

  it("does a value change with store with JSX.Element[] to string", () => {
    const Component = component("Component", () => (
      <local.Observer>
        {(state) =>
          state === "foo" ? (
            <span>{[<div>{state}</div>, <span>{state}</span>]}</span>
          ) : (
            <span>{state}</span>
          )
        }
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes[0].childNodes.length).toBe(2);
    const target = container.childNodes[0].childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.innerHTML).toBe("foo");

    const targetSecond = container.childNodes[0].childNodes[1] as HTMLElement;
    expect(targetSecond.nodeName).toBe("SPAN");
    expect(targetSecond.innerHTML).toBe("foo");
    local.dispatch("bar");

    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("bar");
  });

  it("does a value change with store with JSX.Element to null", () => {
    const Component = component("Component", () => (
      <local.Observer>
        {(state) => (state === "foo" ? <div>foo</div> : null)}
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.innerHTML).toBe("foo");

    local.dispatch("bar");
    expect(container.childNodes.length).toBe(0);
  });

  it("nested text-elements creation of not previously existing element", () => {
    const local = store(true, (_previousState, action: boolean) => action);
    const Component = component("Component", () => (
      <local.Observer>
        {(state) => (state === true ? <div /> : <div>foo</div>)}
      </local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");
    expect(target.innerHTML).toBe("");

    local.dispatch(false);

    const targetSecond = container.childNodes[0] as HTMLElement;
    expect(targetSecond.nodeName).toBe("DIV");
    expect(targetSecond.innerHTML).toBe("foo");
  });

  it("conditional rendering - inclduing correct ordering", () => {
    const local = store(false, (_previousState, action: boolean) => action);
    const Component = component("Component", () => (
      <div>
        <span />
        <local.Observer>{(state) => state && "foo"}</local.Observer>
        <span />
      </div>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLElement;
    expect(target.nodeName).toBe("DIV");

    expect(target.childNodes.length).toBe(2);
    expect(target.childNodes[0].nodeName).toBe("SPAN");
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe("");
    expect(target.childNodes[1].nodeName).toBe("SPAN");
    expect((target.childNodes[1] as HTMLElement).innerHTML).toBe("");

    local.dispatch(true);

    expect(target.childNodes.length).toBe(3);
    expect(target.childNodes[0].nodeName).toBe("SPAN");
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe("");
    expect(target.childNodes[1].nodeName).toBe("#text");
    expect((target.childNodes[1] as Text).textContent).toBe("foo");
    expect(target.childNodes[2].nodeName).toBe("SPAN");
    expect((target.childNodes[0] as HTMLElement).innerHTML).toBe("");
  });

  it("placeholder rendering - update", () => {
    const local = store(0, (previousState, _action: null) => previousState + 1);
    const Component = component("Component", () => (
      <div>
        {false}
        <local.Observer>{(state) => state}</local.Observer>
      </div>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLElement;
    expect(target.innerHTML).toBe("0");

    local.dispatch(null);

    expect(target.innerHTML).toBe("1");
  });

  it("dom with lesser attributes after update", () => {
    const local = store(true, (_previousState, action: boolean) => action);
    const Component = component("Component", () => (
      <local.Observer>
        {(state) => (state ? <div class="foo" /> : <div />)}
      </local.Observer>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLElement;

    expect(target.className).toBe("foo");
    local.dispatch(false);

    expect(target.className).toBe("");
  });

  it("dom with lesser attributes after update, even for events", () => {
    const clickHandler = jest.fn();
    const local = store(true, (_previousState, action: boolean) => action);
    const Component = component("Component", () => (
      <local.Observer>
        {(state) => (state ? <div onclick={clickHandler} /> : <div />)}
      </local.Observer>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLElement;

    const clickEvent = new Event("click");
    target.dispatchEvent(clickEvent);

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(clickEvent);

    local.dispatch(false);

    const anotherClickEvent = new Event("click");
    target.dispatchEvent(clickEvent);

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenCalledWith(anotherClickEvent);
  });

  it("dont call setText when text changed", () => {
    const local = store(
      0,
      (previousState, action: number) => previousState + action
    );
    const Component = component("Component", () => (
      <local.Observer>{(state) => <div>{state}</div>}</local.Observer>
    ));
    plusnew.render(<Component />, { driver: driver(container) });

    const staticText = container.childNodes[0] as Text;

    expect(staticText.textContent).toBe("0");
    expect(setTextSpy).toHaveBeenCalledTimes(0);

    local.dispatch(1);

    expect(staticText.textContent).toBe("1");
    expect(setTextSpy).toHaveBeenCalledTimes(1);
  });

  it("dont call setText when text didnt change", () => {
    const local = store(
      0,
      (previousState, action: number) => previousState + action
    );
    const Component = component("Component", () => <div>static text</div>);
    plusnew.render(<Component />, { driver: driver(container) });

    const staticText = container.childNodes[0] as Text;

    expect(staticText.textContent).toBe("static text");
    expect(setTextSpy).toHaveBeenCalledTimes(0);

    local.dispatch(1);

    expect(staticText.textContent).toBe("static text");
    expect(setTextSpy).toHaveBeenCalledTimes(0);
  });
});
