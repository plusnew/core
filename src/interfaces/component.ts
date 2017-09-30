import LifeCycleHandler from 'ComponentHandler/LifeCycleHandler';
import PlusnewAbstractElement from 'PlusnewAbstractElement';

/**
 * thats how a application component should look like
 */
export default interface component<props> {
  (props?: props, lifeCycleHandler?: LifeCycleHandler): (props?: props) => PlusnewAbstractElement | PlusnewAbstractElement[];
}
