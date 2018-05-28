import { ApplicationElement } from '../../interfaces/component';
import Instance, { getPredeccessor, predecessor } from './Instance';
import factory from '../factory';

export default abstract class ChildrenInstance extends Instance {
  public rendered: Instance[];

  constructor(
    abstractElement: ApplicationElement,
    parentInstance: Instance,
    getPredecessor: getPredeccessor,
  ) {
    super(abstractElement, parentInstance, getPredecessor);

    this.rendered = [];
  }

  abstract getChildrenPredeccessor(): predecessor;

  public addChildren(children: ApplicationElement[]) {
    for (let i = 0; i < children.length; i += 1) {
      this.rendered.push(factory(children[i], this, this.getLastIntrinsicElementOf.bind(this, i - 1)));
    }
  }

  public getLastIntrinsicElement() {
    return this.getLastIntrinsicElementOf(this.rendered.length - 1);
  }

  public getLastIntrinsicElementOf(index: number) {
    for (let i = index; i >= 0 && i < this.rendered.length; i -= 1) {
      const predeccessorElement =  this.rendered[i].getLastIntrinsicElement();
      if (predeccessorElement !== null) {
        return predeccessorElement;
      }
    }
    return this.getChildrenPredeccessor();
  }

  /**
   * moves the children to another dom position
   */
  public move(predecessor: predecessor) {
    for (let i = this.rendered.length; i > 0; i -= 1) {
      this.rendered[i - 1].move(predecessor);
    }
  }

  /**
   * removes the children from the dom
   */
  public remove() {
    this.rendered.forEach(child => child.remove());
  }
}
