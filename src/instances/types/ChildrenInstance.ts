import { ApplicationElement } from '../../interfaces/component';
import Instance, { getSuccessor, successor } from './Instance';
import factory from '../factory';

export default abstract class ChildrenInstance extends Instance {
  public rendered: Instance[];

  constructor(
    abstractElement: ApplicationElement,
    parentInstance: Instance,
    getSuccessor: getSuccessor,
  ) {
    super(abstractElement, parentInstance, getSuccessor);

    this.rendered = [];
  }

  abstract getChildrenSuccessor(): successor;

  public addChildren(children: ApplicationElement[]) {
    for (let i = 0; i < children.length; i += 1) {
      this.rendered.push(factory(children[i], this, this.getFirstIntrinsicElementOf.bind(this, i + 1)));
    }

    return this;
  }

  public getFirstIntrinsicElement() {
    return this.getFirstIntrinsicElementOf(0);
  }

  public getFirstIntrinsicElementOf(index: number) {
    for (let i = index; i < this.rendered.length; i += 1) {
      const successorElement =  this.rendered[i].getFirstIntrinsicElement();
      if (successorElement !== null) {
        return successorElement;
      }
    }
    return this.getChildrenSuccessor();
  }

  /**
   * moves the children to another dom position
   */
  public move(successor: successor) {
    for (let i = 0; i < this.rendered.length; i += 1) {
      this.rendered[i].move(successor);
    }

    return this;
  }

  /**
   * removes the children from the dom
   */
  public remove() {
    this.rendered.forEach(child => child.remove());

    return this;
  }
}
