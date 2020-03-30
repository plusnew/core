import plusnew, { component, Props, ApplicationElement } from "../../../index";

describe("checking if createElement works as expected", () => {
  it("Is div element created", () => {
    const instance = plusnew.createElement("div", {});
    expect(instance.type).toBe("div");
  });

  it("Is text element created", () => {
    const instance = plusnew.createElement(0, null);
    expect(instance.type).toBe(0);
  });

  it("Is div props correct created", () => {
    const props = {
      class: "foo",
    };

    const instance = plusnew.createElement("div", props);
    expect(instance.props).toEqual({ ...props, children: [] });
    // The props should be equal, but not be the same - reference breaking
    expect(instance.props).not.toBe(props as any);
  });

  it("Is div props correct created when null", () => {
    const instance = plusnew.createElement("div", {});
    expect(instance.props).toEqual({ children: [] });
  });

  it("Is div props correct created when adding children", () => {
    const child = plusnew.createElement("span", {});
    const instance = plusnew.createElement("div", {}, child);
    expect((instance.props.children as ApplicationElement[]).length).toBe(1);
    expect((instance.props.children as ApplicationElement[])[0]).toBe(child);
  });

  it("Is div props correct created when adding children without reference", () => {
    const child = plusnew.createElement("span", {});
    const props = {
      class: "foo",
    };

    const instance = plusnew.createElement("div", props, child);
    expect((instance.props.children as ApplicationElement[]).length).toBe(1);
    expect((instance.props.children as ApplicationElement[])[0]).toBe(child);
    expect(props).not.toContain("children");
  });

  it("Is div props correct created when creating multiple children", () => {
    const firstChild = plusnew.createElement("span", {});
    const secondChild = plusnew.createElement("ul", {
      class: "3",
    });
    const instance = plusnew.createElement("div", {}, firstChild, secondChild);
    expect((instance.props.children as ApplicationElement[])[0]).toBe(
      firstChild
    );
    expect((instance.props.children as ApplicationElement[])[1]).toBe(
      secondChild
    );
  });

  it("check if component gets safed", () => {
    const Component = component("Component", (_Props: Props<{ foo: string }>) =>
      plusnew.createElement("div", {})
    );

    const props = { foo: "bar" };
    const instance = plusnew.createElement(Component, props);
    expect(instance.type).toBe(Component);
    expect(instance.props).toEqual({ ...props, children: [] });
    expect(instance.props).not.toBe(props as any);
  });

  it("Is text element created", () => {
    const instance = plusnew.createElement(plusnew.Fragment, null);
    expect(instance.type).toBe(plusnew.Fragment);
  });
});
