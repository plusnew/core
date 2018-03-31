import { ApplicationElement } from '../../interfaces/component';
import Instance from './Instance';
import factory from '../factory';

export default abstract class ChildrenInstance extends Instance {
  public rendered: Instance[];

  constructor(
    abstractElement: ApplicationElement,
    parentInstance: Instance,
    previousAbstractSiblingCount: () => number,
  ) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    this.rendered = [];
  }

  abstract getPreviousSiblingsForChildren(): number;

  /**
   * calculates the previous siblinglength
   */
  public getPreviousLength(instanceIndex: number) {
    let previousCount = this.getPreviousSiblingsForChildren();

    for (let i = 0; i < instanceIndex; i += 1) {
      previousCount += this.rendered[i].getLength();
    }
    return previousCount;
  }

  public addChildren(children: ApplicationElement[]) {
    for (let i = 0; i < children.length; i += 1) {
      this.rendered.push(factory(children[i], this, this.getPreviousLength.bind(this, i)));
    }

    return this;
  }

  /**
   * the length is dependent on the amount of array entities
   */
  public getLength() {
    let length = 0;
    for (let i = 0; i < this.rendered.length; i += 1) {
      length += this.rendered[i].getLength();
    }
    return length;
  }

  /**
   * moves the children to another dom position
   */
  public move(position: number) {
    for (let i = this.getLength(); i > 0; i -= 1) {
      this.rendered[i - 1].move(position);
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
