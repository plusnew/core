export default class Element {
  public type: string;
  public props: any;
  constructor(type: string, props: any, children: Element[]) {
    this.setType(type)
        .setProps(props);
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
}
