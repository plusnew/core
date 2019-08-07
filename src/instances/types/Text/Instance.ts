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
    getPredecessor: getPredeccessor,
    renderOptions: renderOptions<HostElement, HostTextElement>,
  ) {
    super(abstractElement, parentInstance, getPredecessor, renderOptions);

    this.props = abstractElement;
    this.ref = renderOptions.driver.createTextElement(abstractElement);

    this.appendToParent(this.ref, getPredecessor());
  }

  public getLastIntrinsicElement() {
    return this.ref;
  }

  public setText(abstractElement: string) {
    this.renderOptions.driver.updateText(this, abstractElement);
  }

  /**
   * moves this textnode inside the dom
   */
  public move(predecessor: predecessor) {
    this.insertBefore(this.ref.parentNode as HostElement, this.ref, predecessor);
  }

  /**
   * removes this textnode from the dom
   */
  public remove() {
    this.renderOptions.driver.removeTextElement(this);
  }

  public reconcile(newAbstractElement: string) {
    reconcile(newAbstractElement, this);
  }
}
