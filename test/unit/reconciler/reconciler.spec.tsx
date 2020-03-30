import driver from "@plusnew/driver-dom/src/driver";
import "@plusnew/driver-dom/src/jsx";
import plusnew from "../../../index";
import component from "../../../src/components/factory";
import factory from "../../../src/instances/factory";
import reconciler from "../../../src/instances/reconciler";
import RootInstance from "../../../src/instances/types/Root/Instance";
import type { ApplicationElement } from "../../../src/interfaces/component";
import elementTypeChecker from "../../../src/util/elementTypeChecker";

function createInstance(applicationElement: ApplicationElement) {
  const renderOptions = { driver: driver(document.createElement("div")) };
  const wrapper = new RootInstance<Element, Text>(
    true,
    undefined,
    () => null,
    renderOptions
  );

  const instance = factory<Element, Text>(
    applicationElement,
    wrapper,
    () => null,
    renderOptions
  );
  instance.initialiseNestedElements();
  return instance;
}
describe("checking if reconciler works as expected", () => {
  describe("isSameAbstractElement()", () => {
    describe("placeholder", () => {
      it("placeholder same as placeholder", () => {
        expect(
          reconciler.isSameAbstractElement(false, createInstance(false))
        ).toBe(true);
      });

      it("placeholder same as array", () => {
        expect(
          reconciler.isSameAbstractElement(false, createInstance([]))
        ).toBe(false);
      });

      it("placeholder same as dom", () => {
        expect(
          reconciler.isSameAbstractElement(false, createInstance(<div />))
        ).toBe(false);
      });

      it("placeholder same as component", () => {
        const Component = component("Component", () => <div />);
        expect(
          reconciler.isSameAbstractElement(false, createInstance(<Component />))
        ).toBe(false);
      });
    });

    describe("dom", () => {
      it("same as placeholder", () => {
        expect(
          reconciler.isSameAbstractElement(<div />, createInstance(false))
        ).toBe(false);
      });

      it("same as array", () => {
        expect(
          reconciler.isSameAbstractElement(<div />, createInstance([]))
        ).toBe(false);
      });

      it("same as dom, of equal type", () => {
        expect(
          reconciler.isSameAbstractElement(<div />, createInstance(<div />))
        ).toBe(true);
      });

      it("same as dom, of unequal type", () => {
        expect(
          reconciler.isSameAbstractElement(<div />, createInstance(<span />))
        ).toBe(false);
      });

      it("same as dom, of equal type, with same key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <div key="0" />,
            createInstance(<div key="0" />)
          )
        ).toBe(true);
      });

      it("same as dom, of equal type, with different key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <div key="0" />,
            createInstance(<div key="1" />)
          )
        ).toBe(false);
      });

      it("same as dom, of equal type, with one key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <div key="0" />,
            createInstance(<div />)
          )
        ).toBe(false);
      });

      it("same as dom, of equal type, with one key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <div />,
            createInstance(<div key="0" />)
          )
        ).toBe(false);
      });

      it("same as component", () => {
        const Component = component("Component", () => <div />);
        expect(
          reconciler.isSameAbstractElement(false, createInstance(<Component />))
        ).toBe(false);
      });
    });

    describe("Component", () => {
      const Component = component("Component", () => <div />);
      const AnotherComponent = component("Component", () => <div />);

      it("are components the same", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component />,
            createInstance(<Component />)
          )
        ).toBe(true);
      });

      it("are components the same with same key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component key={1} />,
            createInstance(<Component key={1} />)
          )
        ).toBe(true);
      });

      it("are components one with key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component key={1} />,
            createInstance(<Component />)
          )
        ).toBe(false);
      });

      it("are components anotherone with key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component />,
            createInstance(<Component key={1} />)
          )
        ).toBe(false);
      });

      it("are components the same with different key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component key={1} />,
            createInstance(<Component key={2} />)
          )
        ).toBe(false);
      });

      it("are different components the same", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component />,
            createInstance(<AnotherComponent />)
          )
        ).toBe(false);
      });

      it("are different components the same with same key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component key={1} />,
            createInstance(<AnotherComponent key={1} />)
          )
        ).toBe(false);
      });

      it("are different components the same with different key", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component key={1} />,
            createInstance(<AnotherComponent key={2} />)
          )
        ).toBe(false);
      });

      it("are components the same as dom", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component />,
            createInstance(<div />)
          )
        ).toBe(false);
      });

      it("are components the same as placeholder", () => {
        expect(
          reconciler.isSameAbstractElement(<Component />, createInstance(false))
        ).toBe(false);
      });

      it("are components the same as text", () => {
        expect(
          reconciler.isSameAbstractElement(
            <Component />,
            createInstance("text")
          )
        ).toBe(false);
      });
    });
  });

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
        (reconciler as any).isSameAbstractElementType(
          "string",
          "another string"
        );
      }).toThrow(new Error("Unknown abstractElement detected"));
    });
  });
});
