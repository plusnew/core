import type { ComponentContainer } from "../components/factory";
import type { ApplicationElement, props } from "../interfaces/component";
import { TypeOfPlusnew } from "../util/symbols";

type PlusnewElement =
  | string
  | number
  | ComponentContainer<any, any, any>
  | symbol;

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
  constructor(
    type: PlusnewElement,
    props: {} | null,
    children: ApplicationElement[]
  ) {
    this.type = type;

    if (props) {
      this.props = { ...props, children }; // Spread is used to remove reference
    } else {
      this.props = { children };
    }
  }
}

export { PlusnewElement };
