import LifeCycleHandler from 'ComponentHandler/LifeCycleHandler';
import PlusnewAbstractElement from 'PlusnewAbstractElement';

export type ApplicationElement = PlusnewAbstractElement | (PlusnewAbstractElement | string)[] | string;

/**
 * thats how a application component should look like
 */
export default interface component<props> {
  (lifeCycleHandler?: LifeCycleHandler, props?: props): (props?: props) => ApplicationElement;
}
