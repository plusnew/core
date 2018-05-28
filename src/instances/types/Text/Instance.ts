import types from '../types';
import Instance from '../Instance';
import reconcile from './reconcile';

export default class TextInstance extends Instance {
  public nodeType = types.Text;
  public type = types.Text;
  public props: string;
  public ref: Text;

  constructor(abstractElement: string, parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    this.props = abstractElement;
    this.ref = document.createTextNode(abstractElement);
    this.appendToParent(this.ref, previousAbstractSiblingCount());
  }
  /**
   * textnode is always a length of one
   */
  public getLength() {
    return 1;
  }

  public setText(abstractElement: string) {
    this.ref.textContent = abstractElement;
  }

  /**
   * moves this textnode inside the dom
   */
  public move(position: number) {
    const parentNode = this.ref.parentNode as Node;
    parentNode.insertBefore(this.ref, parentNode.childNodes[position]);
  }

  /**
   * removes this textnode from the dom
   */
  public remove() {
    this.ref.remove();
  }

  public reconcile(newAbstractElement: string) {
    reconcile(newAbstractElement, this);
  }
}
