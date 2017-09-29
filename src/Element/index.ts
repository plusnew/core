export default class Element {
  public type: string;
  public props: any;
  constructor(type: string, props: {} | null, children: Element[]) {
    this.setType(type)
        .setProps(props)
        .setChildren(children);
  }

  private setType(type: string) {
    this.type = type;

    return this;
  }

  private setProps(props: any) {
    if (props) {
      this.props = props;
    } else {
      this.props = {};
    }

    return this;
  }

  private setChildren(children: Element[]) {
    if (children.length !== 0) {
      if (children.length === 1) {
        this.props = {
          ...this.props,
          children: children[0],
        };
      } else {
        this.props = {
          ...this.props,
          children,
        };
      }
    }
  }
}
