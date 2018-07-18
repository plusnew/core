import PlusnewAbstractElement from '../PlusnewAbstractElement';
import { options } from '../interfaces/component';
import { stores } from './factory';

export default abstract class Component<props> {
  abstract dependencies: stores;

  constructor(props: props) {
  }

  abstract render(props: props, options: options<props, stores>): PlusnewAbstractElement;
}
