import { props, ApplicationElement } from '../interfaces/component';
import { ComponentContainer } from '../components/factory';
import { TypeOfPlusnew } from '../util/symbols';

type PlusnewElement = string | number | ComponentContainer<any> | Symbol;

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
    this.setType(type);
    this.setProps(props, children);
  }

  /**
   * sets the information what domnode or component this is
   */
  private setType(type: PlusnewElement) {
    this.type = type;
  }

  /**
   * sets the props given from the parent
   */
  private setProps(props: any, children: ApplicationElement[]) {
    if (props) {
      this.props = { ...props, children }; // Spread is used to remove reference
    } else {
      this.props = { children };
    }
  }
}

export { PlusnewElement };
