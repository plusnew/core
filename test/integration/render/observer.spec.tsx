import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew, { component, store } from "../../../index";
import type PlusnewAbstractElement from "../../../src/PlusnewAbstractElement";

describe("<Observer />", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
  });

  it("observer are rerendering when store changes", () => {
    const renderSpy = jest.fn((value: number) => <div>{value}</div>);

    const local = store(1, (_state, action: number) => action);

    const Component = component("Component", () => (
      <local.Observer>{renderSpy}</local.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1");

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledWith(1);

    local.dispatch(2);

    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("2");

    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(renderSpy).toHaveBeenCalledWith(2);
  });

  it("observer are rerendering when props changes", () => {
    const renderSpy = jest.fn((value: number) => <div>{value}</div>);

    const local = store(0, (_state, action: number) => action);
    const localContainer = store<
      (value: number) => PlusnewAbstractElement,
      (value: number) => PlusnewAbstractElement
    >(renderSpy, (_state, action) => action);

    const Component = component("Component", () => (
      <localContainer.Observer>
        {(state) => <local.Observer>{state}</local.Observer>}
      </localContainer.Observer>
    ));

    plusnew.render(<Component />, { driver: driver(container) });

    const target = container.childNodes[0] as HTMLElement;
    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("0");

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledWith(0);

    const newRenderSpy = jest.fn((value: number) => <div>{value}</div>);

    localContainer.dispatch(newRenderSpy);

    expect(container.childNodes.length).toBe(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("0");
    expect(container.childNodes[0] as HTMLElement).toBe(target);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(newRenderSpy).toHaveBeenCalledTimes(1);
    expect(newRenderSpy).toHaveBeenCalledWith(0);
  });
});
