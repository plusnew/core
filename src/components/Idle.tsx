import plusnew, { Props, Component, store } from '../index';

type props = { urgent: boolean; children: any; };

export default class Idle extends Component<props> {
  static displayName = 'Idle'

  private hasIdleCallback() {
    return 'requestIdleCallback' in window;
  }

  render(Props: Props<props>) {
    let idleHandle: null | number = null;
    const showContentStore = store(false, (_state, action: boolean) => action);

    if (this.hasIdleCallback() && Props.getState().urgent === false) {
      idleHandle = (window as any).requestIdleCallback(() => {
        idleHandle = null;
        showContentStore.dispatch(true);
      });
    } else {
      showContentStore.dispatch(true);
    }

    return (
      <showContentStore.Observer>
        {showContentState =>
          <Props>
            {(props) => {
              const showContent = props.urgent || showContentState;
              if (props.urgent && idleHandle !== null) {
                (window as any).cancelIdleCallback(idleHandle);
              }

              if (showContent) {
                return props.children;
              }
              return null;
            }}
          </Props>
        }
      </showContentStore.Observer>
    );
  }
}
