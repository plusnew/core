import type { props } from "../../../interfaces/component";
import type { renderOptions } from "../../../interfaces/renderOptions";
import type PlusnewAbstractElement from "../../../PlusnewAbstractElement";
import type { PlusnewElement } from "../../../PlusnewAbstractElement";
import Instance, { getPredeccessor } from "../Instance";
import types from "../types";

export default class ShallowInstance<
  componentProps extends Partial<props>,
  HostElement,
  HostTextElement
> extends Instance<HostElement, HostTextElement> {
  public nodeType = types.Component as const;
  public type: PlusnewElement;
  public props: componentProps;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance<HostElement, HostTextElement>,
    getPredecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>
  ) {
    super(abstractElement, parentInstance, getPredecessor, renderOptions);

    this.type = abstractElement.type;
    this.props = abstractElement.props as componentProps;
  }

  public getLastIntrinsicInstance() {
    return null;
  }

  /**
   * shallowcomponent has no object, which needs moving
   */
  public move() {
    // Because shallowcomponents are not really inserted in the dom, no actual action is needed
  }

  /**
   * shallowcomponent has no object, which needs removing
   */
  public remove() {}

  /**
   * a shallow instance is nothing actually present in the dom
   * it just needs to hold all the currently interesting informations
   */
  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    this.props = newAbstractElement.props as componentProps;
  }
}
