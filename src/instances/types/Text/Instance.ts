import types from '../types';
import Instance, { getPredeccessor, predecessor } from '../Instance';
import reconcile from './reconcile';

export default class TextInstance extends Instance {
  public nodeType = types.Text;
  public type = types.Text;
  public props: string;
  public ref: Text;

  constructor(abstractElement: string, parentInstance: Instance, getPredecessor: getPredeccessor) {
    super(abstractElement, parentInstance, getPredecessor);

    this.props = abstractElement;
    this.ref = document.createTextNode(abstractElement);

    this.appendToParent(this.ref, getPredecessor());
  }

  public getLastIntrinsicElement() {
    return this.ref;
  }

  public setText(abstractElement: string) {
    this.ref.textContent = abstractElement;

    return this;
  }

  /**
   * moves this textnode inside the dom
   */
  public move(predecessor: predecessor) {
    this.insertBefore(this.ref.parentNode as Node, this.ref, predecessor);
    return this;
  }

  /**
   * removes this textnode from the dom
   */
  public remove() {
    this.ref.remove();

    return this;
  }

  public reconcile(newAbstractElement: string) {
    reconcile(newAbstractElement, this);
    return this;
  }
}
