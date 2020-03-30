import type { renderOptions } from "../../../interfaces/renderOptions";
import type PlusnewAbstractElement from "../../../PlusnewAbstractElement";
import ChildrenInstance from "../ChildrenInstance";
import type Instance from "../Instance";
import type { getPredeccessor } from "../Instance";
import types from "../types";
import reconcile from "./reconcile";

/**
 * ArrayInstances are used for representing lists in the shadowdon
 * and they correspond for creating and deleting instances of the corresponding entities
 */
export default class ArrayInstance<
  HostElement,
  HostTextElement
> extends ChildrenInstance<HostElement, HostTextElement> {
  public nodeType = types.Array as const;
  public type = types.Array;
  public props: { children: PlusnewAbstractElement[] };
  public executeChildrenElementWillUnmount = true;

  constructor(
    abstractElements: PlusnewAbstractElement[],
    parentInstance: Instance<HostElement, HostTextElement>,
    getPredecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>
  ) {
    super(abstractElements, parentInstance, getPredecessor, renderOptions);
    this.props = {
      children: abstractElements,
    };
  }

  initialiseNestedElements() {
    this.addChildren();
  }

  /**
   * updates the shadowdom and dom
   */
  public reconcile(newAbstractElements: PlusnewAbstractElement[]) {
    reconcile(newAbstractElements, this);
  }

  /**
   * gets dom element predecessing the array for the children instances
   * and returns the predeccessor of this array
   */
  public getChildrenPredeccessor() {
    return this.getPredecessor();
  }
}
