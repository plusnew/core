import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew, { component, store } from "../../../index";
import type { Props } from "../../../index";

describe("lifecycle", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
  });

  describe("componentDidMount", () => {
    it("basic hook doing nothing", () => {
      const componentDidMountSpy = jest.fn();

      const NestedComponent = component(
        "Component",
        (_Props: Props<{}>, componentInstance) => {
          componentInstance.registerLifecycleHook(
            "componentDidMount",
            componentDidMountSpy
          );

          return <div />;
        }
      );

      const local = store(false);

      const MainComponent = component("Component", () => (
        <local.Observer>
          {(local) => local && <NestedComponent />}
        </local.Observer>
      ));

      plusnew.render(<MainComponent />, { driver: driver(container) });

      expect(container.childNodes.length).toBe(0);
      expect(componentDidMountSpy).toHaveBeenCalledTimes(0);

      local.dispatch(true);

      expect(container.childNodes.length).toBe(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
      expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
    });

    it("First nested component dispatches a value to local store in parent and gets rerendered and displayed in DOM only once", () => {
      const renderSpy = jest.fn(
        (Props: Props<{ value: number }>, componentInstance) => {
          componentInstance.registerLifecycleHook("componentDidMount", () => {
            local.dispatch(1);
          });

          return (
            <div>
              <Props>{(props) => props.value}</Props>
            </div>
          );
        }
      );

      const anotherRenderSpy = jest.fn(
        (Props: Props<{ value: number }>, _componentInstance) => {
          return (
            <span>
              <Props>{(props) => props.value}</Props>
            </span>
          );
        }
      );

      const NestedComponent = component<{ value: number }, Element, Text>(
        "Component",
        renderSpy
      );

      const AnotherNestedComponent = component<
        { value: number },
        Element,
        Text
      >("Component", anotherRenderSpy);

      const local = store(0);

      const MainComponent = component("Component", () => (
        <local.Observer>
          {(local) => (
            <>
              <NestedComponent value={local} />
              <AnotherNestedComponent value={local} />
            </>
          )}
        </local.Observer>
      ));

      plusnew.render(<MainComponent />, { driver: driver(container) });

      expect(container.childNodes.length).toBe(2);
      expect(renderSpy).toHaveBeenCalledTimes(1);
      expect(anotherRenderSpy).toHaveBeenCalledTimes(1);
      expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
      expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1");
      expect((container.childNodes[1] as HTMLElement).tagName).toBe("SPAN");
      expect((container.childNodes[1] as HTMLElement).innerHTML).toBe("1");
    });
  });

  it("Second nested component dispatches a value to local store in parent and gets rerendered and displayed in DOM only once", () => {
    const renderSpy = jest.fn(
      (Props: Props<{ value: number }>, componentInstance) => {
        componentInstance.registerLifecycleHook("componentDidMount", () => {
          local.dispatch(1);
        });

        return (
          <div>
            <Props>{(props) => props.value}</Props>
          </div>
        );
      }
    );

    const anotherRenderSpy = jest.fn(
      (Props: Props<{ value: number }>, _componentInstance) => {
        return (
          <span>
            <Props>{(props) => props.value}</Props>
          </span>
        );
      }
    );

    const NestedComponent = component<{ value: number }, Element, Text>(
      "Component",
      renderSpy
    );

    const AnotherNestedComponent = component<{ value: number }, Element, Text>(
      "Component",
      anotherRenderSpy
    );

    const local = store(0);

    const MainComponent = component("Component", () => (
      <local.Observer>
        {(local) => (
          <>
            <AnotherNestedComponent value={local} />
            <NestedComponent value={local} />
          </>
        )}
      </local.Observer>
    ));

    plusnew.render(<MainComponent />, { driver: driver(container) });

    expect(container.childNodes.length).toBe(2);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(anotherRenderSpy).toHaveBeenCalledTimes(1);
    expect((container.childNodes[0] as HTMLElement).tagName).toBe("SPAN");
    expect((container.childNodes[0] as HTMLElement).innerHTML).toBe("1");
    expect((container.childNodes[1] as HTMLElement).tagName).toBe("DIV");
    expect((container.childNodes[1] as HTMLElement).innerHTML).toBe("1");
  });

  describe("componentWillUnmount", () => {
    it("basic hook doing nothing", () => {
      const componentWillUnmountSpy = jest.fn();

      const NestedComponent = component(
        "Component",
        (_Props: Props<{}>, componentInstance) => {
          componentInstance.registerLifecycleHook(
            "componentWillUnmount",
            componentWillUnmountSpy
          );

          return <div />;
        }
      );

      const local = store(false);

      const MainComponent = component("Component", () => (
        <local.Observer>
          {(local) => local && <NestedComponent />}
        </local.Observer>
      ));

      plusnew.render(<MainComponent />, { driver: driver(container) });

      expect(container.childNodes.length).toBe(0);
      expect(componentWillUnmountSpy).toHaveBeenCalledTimes(0);

      local.dispatch(true);

      expect((container.childNodes[0] as HTMLElement).tagName).toBe("DIV");
      expect(container.childNodes.length).toBe(1);
      expect(componentWillUnmountSpy).toHaveBeenCalledTimes(0);

      local.dispatch(false);

      expect(componentWillUnmountSpy).toHaveBeenCalledTimes(1);
      expect(container.childNodes.length).toBe(0);
    });
  });

  xit("componentDidReceiveProps", () => {});
});
