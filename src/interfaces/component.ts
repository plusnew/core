import observer from './observer';

export default interface component<props> {
  (props?: props, observer?: observer): (props?: props) => JSX.Element;
}
