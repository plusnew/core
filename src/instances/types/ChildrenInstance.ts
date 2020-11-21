import type { ApplicationElement } from "../../interfaces/component";
import type { renderOptions } from "../../interfaces/renderOptions";
import type PlusnewAbstractElement from "../../PlusnewAbstractElement";
import factory from "../factory";
import Instance, { getPredeccessor, predecessor } from "./Instance";

export default abstract class ChildrenInstance<
  HostElement,
  HostTextElement
> extends Instance<HostElement, HostTextElement> {
  public rendered: Instance<HostElement, HostTextElement>[];
  // Decides if the children will call elementWillUnmount
  public abstract executeChildrenElementWillUnmount: boolean;
  public abstract props: { children: PlusnewAbstractElement[] };

  constructor(
    abstractElement: ApplicationElement,
    parentInstance: Instance<HostElement, HostTextElement>,
    getPredecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>
  ) {
    super(abstractElement, parentInstance, getPredecessor, renderOptions);
    this.rendered = [];
  }

  abstract getChildrenPredeccessor(): predecessor<HostElement, HostTextElement>;

  public addChildren() {
    for (
      let i = 0;
      i < this.props.children.length && this.errored === false;
      i += 1
    ) {
      if (this.rendered[i] === undefined) {
        const instance = factory(
          this.props.children[i],
          this,
          this.getLastIntrinsicElementOf.bind(this, i - 1),
          this.renderOptions
        );
        this.rendered.push(instance);

        instance.initialiseNestedElements();

        this.errored = instance.errored;
      }
    }
  }

  public getLastIntrinsicInstance() {
    return this.getLastIntrinsicElementOf(this.rendered.length - 1);
  }

  public getLastIntrinsicElementOf(index: number) {
    for (let i = index; i >= 0 && i < this.rendered.length; i -= 1) {
      const predeccessorElement = this.rendered[i].getLastIntrinsicInstance();
      if (predeccessorElement !== null) {
        return predeccessorElement;
      }
    }
    return this.getChildrenPredeccessor();
  }

  /**
   * moves the children to another dom position
   */
  public move(predecessor: predecessor<HostElement, HostTextElement>) {
    for (let i = this.rendered.length; i > 0; i -= 1) {
      this.rendered[i - 1].move(predecessor);
    }
  }

  /**
   * removes the domnode from the parent
   */
  public remove(prepareRemoveSelf: boolean) {
    let result: Promise<any> | void;

    if (prepareRemoveSelf) {
      result = this.prepareRemoveSelf();
    }

    if (result) {
      return result.then(() => this.removeChildren(prepareRemoveSelf));
    }
    return this.removeChildren(prepareRemoveSelf);
  }

  private removeChildren(prepareRemoveSelf: boolean) {
    const executeChildrenElementWillUnmount =
      prepareRemoveSelf === false
        ? false
        : this.executeChildrenElementWillUnmount;
    const result = this.rendered
      .map((child) => child.remove(executeChildrenElementWillUnmount))
      .filter((result) => result !== undefined);

    if (result.length === 0) {
      return this.removeSelf();
    }

    return new Promise<void>((resolve) => {
      Promise.all(result).then(() => {
        this.removeSelf();
        resolve();
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
