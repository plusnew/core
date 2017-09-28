import componentHandler from './componentHandler';

export default interface component<props> {
  (props?: props, componentHandler?: componentHandler): (props?: props) => JSX.Element;
}
