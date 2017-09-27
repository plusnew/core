import redchain from 'redchain';

export default interface component<props> {
  (props?: props): {
    stores?: {
      [store: string]: redchain<any, any>;
    }
    actions?: {
      [actionName: string]: (event: Event) => void;
    };
    render: (props: props) => JSX.Element;
  };
}
