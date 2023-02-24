import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew, { component } from "../../../index";

describe("firing onchange events", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML = "lots of stuff";
    document.body.appendChild(container);
  });

  describe("select", () => {
    it("throws exception when no select parent is found", () => {
      const Component = component("Component", () => <option />);

      expect(() => {
        plusnew.render(<Component />, { driver: driver(container) });
      }).toThrowError();
    });

    it("throw exception when the nearest dom is not an option", () => {
      const Component = component("Component", () => (
        <select value="foo">
          <div>
            <option />
          </div>
        </select>
      ));

      expect(() => {
        plusnew.render(<Component />, { driver: driver(container) });
      }).toThrowError();
    });

    it("initial value of option", () => {
      const Component = component("Component", () => (
        <select oninput={() => null} value="bar">
          <option value="foo">Foo</option>
          <option value="bar">Bar</option>
        </select>
      ));

      plusnew.render(<Component />, { driver: driver(container) });

      const select = container.childNodes[0] as HTMLSelectElement;

      expect(select.value).toBe("bar");
    });
  });
});
