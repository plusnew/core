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

  abstract getChildrenSuccessor(): getSuccessor;

  public addChildren(children: ApplicationElement[]) {
    for (let i = 0; i < children.length; i += 1) {
      this.rendered.push(factory(children[i], this, this.getChildrenSuccessor()));
    }

    return this;
  }

  public getSuccessorOf(index: number) {
    for (let successor = index + 1; successor < this.rendered.length; successor += 1) {
      const successorElement =  this.rendered[successor].getFirstIntrinsicElement();
      if (successorElement !== null) {
        return successorElement;
      }
    }
    return this.getSuccessor();
  }

  public getFirstIntrinsicElement() {
    return this.getSuccessorOf(0);
  }

  /**
   * moves the children to another dom position
   */
  public move(successor: successor) {
    for (let i = this.rendered.length; i > 0; i -= 1) {
      this.rendered[i - 1].move(successor);
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
