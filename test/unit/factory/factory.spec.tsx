import factory from "../../../src/instances/factory";
import elementTypeChecker from "../../../src/util/elementTypeChecker";
import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";

describe("isSameAbstractElementType()", () => {
  beforeEach(() => {
    jest
      .spyOn(elementTypeChecker, "isPlaceholderElement")
      .mockReturnValue(false);
    jest.spyOn(elementTypeChecker, "isTextElement").mockReturnValue(false);
    jest.spyOn(elementTypeChecker, "isArrayElement").mockReturnValue(false);
    jest.spyOn(elementTypeChecker, "isFragmentElement").mockReturnValue(false);
    jest.spyOn(elementTypeChecker, "isDomElement").mockReturnValue(false);
    jest.spyOn(elementTypeChecker, "isComponentElement").mockReturnValue(false);
  });
  it("unknown element", () => {
    expect(() => {
      factory("string", "another string" as any, () => null, {
        driver: driver(document.createElement("div")),
      });
    }).toThrow(new Error("Factory couldn't create unknown element type"));
  });
});
