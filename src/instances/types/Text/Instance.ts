import type { TextInstance as ITextInstance } from "../../../interfaces/driver";
import type { renderOptions } from "../../../interfaces/renderOptions";
import Instance, { getPredeccessor, predecessor } from "../Instance";
import types from "../types";
import reconcile from "./reconcile";

export default class TextInstance<HostElement, HostTextElement>
  extends Instance<HostElement, HostTextElement>
  implements ITextInstance<HostElement, HostTextElement> {
  public nodeType = types.Text as const;
  public type = types.Text;
  public props: string;
  public ref: HostTextElement;

  constructor(
    abstractElement: string,
    parentInstance: Instance<HostElement, HostTextElement>,
    getPredecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>
  ) {
    super(abstractElement, parentInstance, getPredecessor, renderOptions);

    this.props = abstractElement;
    this.ref = renderOptions.driver.text.create(abstractElement);

    this.appendToParent(this, getPredecessor());
  }

  public getLastIntrinsicInstance() {
    return this;
  }

  public setText(abstractElement: string) {
    this.renderOptions.driver.text.update(this, abstractElement);
  }

  /**
   * moves this textnode inside the dom
   */
  public move(predecessor: predecessor<HostElement, HostTextElement>) {
    this.renderOptions.driver.text.moveAfterSibling(this, predecessor);
  }

  /**
   * removes this textnode from the dom
   */
  public remove() {
    this.renderOptions.driver.text.remove(this);
  }

  public reconcile(newAbstractElement: string) {
    reconcile(newAbstractElement, this);
  }
}
