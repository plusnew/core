import plusnew, { Props, Component, ApplicationElement, store } from '../index';

type renderFunction = () => ApplicationElement;

type props = {
  catch: (error: any) => ApplicationElement;
  children: renderFunction;
};

export default class Try extends Component<props> {
  static displayName = 'ComponentName';

  render(Props: Props<props>) {
    const hasErrored = store(false);

    return (
      <Props>{(props) => {
        try {
          return ((props.children as any)[0] as renderFunction)();
        } catch (error) {
          return props.catch(error);
        }
      }}</Props>
    );
  }
}
