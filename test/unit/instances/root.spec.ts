import driver from "@plusnew/driver-dom/src/driver";
import Instance from "../../../src/instances/types/Root/Instance";

describe("root", () => {
  it("move", () => {
    expect(() => {
      Instance.prototype.move();
    }).toThrow(new Error("The root element can't move itself"));
  });

  it("reconcile", () => {
    expect(() => {
      Instance.prototype.reconcile(false);
    }).toThrow(new Error("The root element can't reconcile itself"));
  });

  it("getFirstIntrinsicElement", () => {
    const instance = new Instance<Element, Text>(true, undefined, () => null, {
      driver: driver(document.createElement("div")),
    });
    expect(() => {
      instance.getLastIntrinsicInstance();
    }).toThrow(
      new Error(
        "The root Element does not allow to give you the last Element Instance"
      )
    );
  });
});
