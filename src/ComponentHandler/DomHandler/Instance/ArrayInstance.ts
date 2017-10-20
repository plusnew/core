import { ApplicationElement } from 'interfaces/component';
import types from './types';
import Instance from './Instance';
import PlusnewAbstractElement from 'PlusnewAbstractElement';
import factory from './factory';

export default class ComponentInstance extends Instance {
  public type: types.Array;
  public abstractElement: (PlusnewAbstractElement | string)[];
  private refs: Instance[];

  constructor(abstractElement: ApplicationElement, parentInstance: Instance, previousAbstractSiblingCount: () => number) {
    super(abstractElement, parentInstance, previousAbstractSiblingCount);

    this.refs = [];

    for (let i = 0; i < this.abstractElement.length; i += 1) {
      this.refs.push(factory(this.abstractElement[i], this, this.getPreviousLength.bind(this, this.refs, i)));
    }
  }

  /**
   * the length is dependent on the amount of array entities
   */
  public getLength() {
    return this.refs.length;
  }
}
