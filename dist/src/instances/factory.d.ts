import { ApplicationElement } from 'interfaces/component';
import Instance from './types/Instance';
/**
 * because data from jsx can be anything, this factory is needed to decide what type of instance should be created
 */
export default function (abstractElement: ApplicationElement, parentInstance: Instance, previousAbstractSiblingCount: () => number): Instance;
