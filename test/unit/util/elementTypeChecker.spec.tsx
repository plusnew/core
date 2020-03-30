import plusnew, { component } from "../../../index";
import util from "../../../src/util/elementTypeChecker";

describe("elementTypeChecker", () => {
  describe("isFragmentElement()", () => {
    it("is fragment a fragment", () => {
      expect(util.isFragmentElement(<></>)).toBe(true);
    });

    it("is element a fragment", () => {
      expect(util.isFragmentElement(<div />)).toBe(false);
    });

    it("is text a fragment", () => {
      expect(util.isFragmentElement("foo")).toBe(false);
    });

    it("is array a fragment", () => {
      expect(util.isFragmentElement([])).toBe(false);
    });

    it("is placeholder a fragment", () => {
      expect(util.isFragmentElement(false)).toBe(false);
    });

    it("is placeholder a fragment", () => {
      const Component = component("Component", () => null);
      expect(util.isFragmentElement(<Component />)).toBe(false);
    });
  });
});
