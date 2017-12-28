import { ApplicationElement } from '../../interfaces/component';
import Instance from './Instance';
import factory from '../factory';

export default abstract class ChildrenInstance extends Instance {
  public children: Instance[];

  constructor(abstractElement: ApplicationElement, parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    this.children = [];
  }

  /**
   * calculates the previous siblinglength
   */
  public getPreviousLength(instanceIndex: number) {
    let previousCount = this.previousAbstractSiblingCount();

    for (let i = 0; i < instanceIndex; i += 1) {
      previousCount += this.children[i].getLength();
    }
    return previousCount;
  }

  public addChildren(children: ApplicationElement[]) {
    for (let i = 0; i < children.length; i += 1) {
      this.children.push(factory(children[i], this, this.getPreviousLength.bind(this, i)));
    }
  }

  /**
   * the length is dependent on the amount of array entities
   */
  public getLength() {
    let length = 0;
    for (let i = 0; i < this.children.length; i += 1) {
      length += this.children[i].getLength();
    }
    return length;
  }

  /**
   * removes the children from the dom
   */
  public remove() {
    this.children.forEach(child => child.remove());

    return this;
  }
}
