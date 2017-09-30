import component from 'interfaces/component';

export default class PlusnewAbstractElement {
  /**
   * The information if what domnode it is, or if it is a component
   */
  public type: string | component<any>;
  /**
   * what properties should your parent give you
   */
  public props: any;
  /**
   * Lightweight representation of a DOM or Component Node, this component is immutable and is used for comparison
   */
  constructor(type: string | component<any>, props: {} | null, children: PlusnewAbstractElement[]) {
    this.setType(type)
        .setProps(props)
        .setChildren(children);
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
  private setProps(props: any) {
    if (props) {
      this.props = { ...props };
    } else {
      this.props = {};
    }

    return this;
  }

  /**
   * sets the children which can be used for the nesting
   */
  private setChildren(children: PlusnewAbstractElement[]) {
    if (children.length !== 0) {
      this.props = {
        ...this.props,
        children,
      };
    }
  }
}
