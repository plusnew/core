import types from '../types';
import Instance from '../Instance';
import ChildrenInstance from '../ChildrenInstance';
import PlusnewAbstractElement from 'PlusnewAbstractElement';
export default class ArrayInstance extends ChildrenInstance {
    type: types;
    abstractElement: (PlusnewAbstractElement | string)[];
    constructor(abstractElements: (PlusnewAbstractElement | string)[], parentInstance: Instance, previousAbstractSiblingCount: () => number);
}
