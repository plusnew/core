import { props, ApplicationElement } from '../interfaces/component';
import { IComponentContainer } from '../components/factory';
import { TypeOfPlusnew } from '../util/symbols';

type PlusnewElement = string | number | IComponentContainer<any, any, any> | Symbol;

export default class PlusnewAbstractElement {
  public $$typeof = TypeOfPlusnew;
  /**
   * The information if what domnode it is, or if it is a component
   */
  public type: PlusnewElement;

  /**
   * what properties should your parent give you
   */
  public props: props;

  /**
   * Lightweight representation of a DOM or Component Node, this component is immutable and is used for comparison
   */
  constructor(type: PlusnewElement, props: {} | null, children: ApplicationElement[]) {
    this.type = type;

    if (props) {
      this.props = { ...props, children }; // Spread is used to remove reference
    } else {
      this.props = { children };
    }
  }
}

export { PlusnewElement };
