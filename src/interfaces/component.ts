import LifeCycleHandler from 'instances/types/Component/LifeCycleHandler';
import PlusnewAbstractElement from 'PlusnewAbstractElement';

export type ApplicationElement = PlusnewAbstractElement | (PlusnewAbstractElement | string)[] | string;

export interface props {
  [key: string]: any;
  children: ApplicationElement[];
}

/**
 * thats how a application component should look like
 */
export default interface component<props> {
  (lifeCycleHandler?: LifeCycleHandler, props?: props): (props?: props) => ApplicationElement;
}
