import component from 'interfaces/component';

export default class Element {
  public type: string | component<any>;
  public props: any;
  constructor(type: string | component<any>, props: {} | null, children: Element[]) {
    this.setType(type)
        .setProps(props)
        .setChildren(children);
  }

  private setType(type: string | component<any>) {
    this.type = type;

    return this;
  }

  private setProps(props: any) {
    if (props) {
      this.props = { ...props };
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
