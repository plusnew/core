import types from '../types';
import Instance, { getSuccessor, successor } from '../Instance';
import reconcile from './reconcile';

export default class TextInstance extends Instance {
  public nodeType = types.Text;
  public type = types.Text;
  public props: string;
  public ref: Text;

  constructor(abstractElement: string, parentInstance: Instance, getSuccessor: getSuccessor) {
    super(abstractElement, parentInstance, getSuccessor);

    this.props = abstractElement;
    this.ref = document.createTextNode(abstractElement);

    this.appendToParent(this.ref, getSuccessor());
  }

  public getFirstIntrinsicElement() {
    return this.ref;
  }

  public setText(abstractElement: string) {
    this.ref.textContent = abstractElement;

    return this;
  }

  /**
   * moves this textnode inside the dom
   */
  public move(successor: successor) {
    const parentNode = this.ref.parentNode as Node;
    parentNode.insertBefore(this.ref, successor);

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
