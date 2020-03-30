import factory from "../../../src/instances/factory";
import elementTypeChecker from "../../../src/util/elementTypeChecker";
import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";

describe("isSameAbstractElementType()", () => {
  beforeEach(() => {
    spyOn(elementTypeChecker, "isPlaceholderElement").and.returnValue(false);
    spyOn(elementTypeChecker, "isTextElement").and.returnValue(false);
    spyOn(elementTypeChecker, "isArrayElement").and.returnValue(false);
    spyOn(elementTypeChecker, "isFragmentElement").and.returnValue(false);
    spyOn(elementTypeChecker, "isDomElement").and.returnValue(false);
    spyOn(elementTypeChecker, "isComponentElement").and.returnValue(false);
  });
  it("unknown element", () => {
    expect(() => {
      factory("string", "another string" as any, () => null, {
        driver: driver(document.createElement("div")),
      });
    }).toThrow(new Error("Factory couldn't create unknown element type"));
  });
});
