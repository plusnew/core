import component, { props } from 'interfaces/component';

export default class PlusnewAbstractElement {
  /**
   * The information if what domnode it is, or if it is a component
   */
  public type: string | component<any>;
  /**
   * what properties should your parent give you
   */
  public props: props;
  /**
   * Lightweight representation of a DOM or Component Node, this component is immutable and is used for comparison
   */
  constructor(type: string | component<any>, props: {} | null, children: PlusnewAbstractElement[]) {
    this.setType(type)
      .setProps(props, children);
  }

  /**
   * sets the information what domnode or component this is
   */
  private setType(type: string | component<any>) {
    this.type = type;

    return this;
  }

  /**
   * sets the props given from the parent
   */
  private setProps(props: any, children: PlusnewAbstractElement[]) {
    if (props) {
      this.props = { ...props, children }; // Spread is used to remove reference
    } else {
      this.props = { children };
    }

    return this;
  }

  /**
   * Checks if the key is a custom element and checks for vulnerable values
   */
  public shouldAddPropToElement(key: string) {
    return key !== 'children'; // @TODO add ref/key
  }
}
