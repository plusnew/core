import type { ApplicationElement } from "../../../interfaces/component";
import type {
  HostInstance,
  RootInstance as IRootInstance,
} from "../../../interfaces/driver";
import type { renderOptions } from "../../../interfaces/renderOptions";
import Instance, { type getPredeccessor, type predecessor } from "../Instance";
import types from "../types";

export default class RootInstance<HostElement, HostTextElement>
  extends Instance<HostElement, HostTextElement>
  implements IRootInstance<HostElement, HostTextElement> {
  public nodeType = types.Root as const;
  public type = types.Root;
  public ref: HostElement;

  constructor(
    abstractElement: ApplicationElement,
    parentInstance: Instance<HostElement, HostTextElement> | undefined,
    getPredecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>
  ) {
    super(abstractElement, parentInstance, getPredecessor, renderOptions);
    this.ref = this.renderOptions.driver.getRootElement(this);
  }
  /**
   * appends the element to the rootcontainer
   */
  public appendChild(
    childInstance: HostInstance<HostElement, HostTextElement>,
    predecessor: predecessor<HostElement, HostTextElement>
  ) {
    this.renderOptions.driver.element.appendChildAfterSibling(
      this,
      childInstance,
      predecessor
    );
  }

  public getLastIntrinsicInstance(): never {
    throw new Error(
      "The root Element does not allow to give you the last Element Instance"
    );
  }

  /**
   * Nobody is above the root, and because of that nobody is able to move the root
   */
  public move(): never {
    throw new Error("The root element can't move itself");
  }

  /**
   * Nobody is above the root, and because of that nobody is able to remove the root
   */
  public remove(): never {
    throw new Error("The root element can't remove itself");
  }

  /**
   * a root instance isn't anything updatable
   */
  public reconcile(_newAbstractElement: false): never {
    throw new Error("The root element can't reconcile itself");
  }
}
