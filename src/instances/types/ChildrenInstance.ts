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
   * removes the domnode from the parent
   */
  public remove() {
    const result = this.prepareRemoveSelf();
    if (result) {
      return result.then(() => this.removeChildren());
    }
    return this.removeChildren();
  }

  private removeChildren() {
    const result = this.rendered.map(child => child.remove()).filter(result => result !== undefined);

    if (result.length === 0) {
      return this.removeSelf();
    }

    return new Promise((resolve) => {
      Promise.all(result).then(() => {
        const result = this.removeSelf();
        if (result) {
          result.then(resolve);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * checks if there is a a hook going on
   */
  public prepareRemoveSelf(): Promise<any> | void {}

  /**
   * removes the children from the dom
   */
  public removeSelf(): Promise<any> | void {}
}
