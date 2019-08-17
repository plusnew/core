import Instance, { getPredeccessor, predecessor } from '../Instance';
import types from '../types';
import reconcile from './reconcile';
import { renderOptions } from '../../../interfaces/renderOptions';

export default class TextInstance<HostElement, HostTextElement> extends Instance<HostElement, HostTextElement> {
  public nodeType = types.Text;
  public type = types.Text;
  public props: string;
  public ref: HostTextElement;

  constructor(
    abstractElement: string,
    parentInstance: Instance<HostElement, HostTextElement>,
    getPredecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>,
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
