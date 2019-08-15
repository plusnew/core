import Instance, { predecessor, getPredeccessor } from '../Instance';
import types from '../types';
import Component from '../../../components/AbstractClass';
import { props, ApplicationElement } from  '../../../interfaces/component';
import PlusnewAbstractElement from '../../../PlusnewAbstractElement';
import store, { storeType } from '../../../util/store';
import factory from '../../factory';
import reconcile, { shouldUpdate } from './reconcile';
import { renderOptions } from '../../../interfaces/renderOptions';

type lifecycle = 'componentDidMount' | 'componentWillUnmount';

/**
 * ComponentInstances are used representing the <Component /> in the shadowdom
 * or when plusnew.createElement gets called with a function
 * it calls the constructure function and keeps the informations what dependencies the component has
 * the render-function of the component gets called immediately after the constructor-function
 * the render-function gets called again when a parent component rerenders
 * or when the dependencie-stores fire the change event
 */
export default class ComponentInstance<componentProps extends Partial<props & { children: any }>, HostElement, HostTextElement> extends Instance<HostElement, HostTextElement> {
  public nodeType = types.Component;
  public rendered: Instance<HostElement, HostTextElement>; // @FIXME This actually should be Instance or undefined
  public applicationInstance: Component<componentProps, HostElement, HostTextElement>;
  public props: componentProps;
  public storeProps: storeType<componentProps, componentProps>;
  public mounted = true; // Has the information that the component is inside the active shadowdom
  public renderOptions: renderOptions<HostElement, HostTextElement>;
  private lifecycleHooks = {
    componentDidMount: [] as (() => void)[],
    componentWillUnmount: [] as (() => void)[],
  };

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance<HostElement, HostTextElement>,
    getPredecessor: getPredeccessor<HostElement, HostTextElement>,
    renderOptions: renderOptions<HostElement, HostTextElement>,
  ) {
    super(abstractElement, parentInstance, getPredecessor, renderOptions);

    this.renderOptions = renderOptions;
    this.type = abstractElement.type;
    this.props = abstractElement.props as componentProps;
    this.storeProps = store(abstractElement.props as componentProps, (state, action: componentProps) => {
      if (shouldUpdate(action, this)) {
        this.props = action;
        return action;
      }
      return state;
    });
  }

  /**
   * this will get called after constructor
   * so that the parent already has the reference to this instance
   *
   * is needed for dispatching while rendering
   */
  public initialiseNestedElements() {
    this.applicationInstance = new (this.type as any)(this.props);
    if (this.renderOptions.invokeGuard === undefined) {
      this.render(
        this.applicationInstance.render(this.storeProps.Observer, this),
      );
    } else {
      const invokeHandle = this.renderOptions.invokeGuard(() => this.applicationInstance.render(this.storeProps.Observer, this));
      if (invokeHandle.hasError === false) {
        this.render(invokeHandle.result);
      }
    }
    this.executeLifecycleHooks('componentDidMount');
  }

  public registerLifecycleHook(lifecycle: lifecycle, hook: () => void) {
    this.lifecycleHooks[lifecycle].push(hook);
  }

  private executeLifecycleHooks(lifecycle: lifecycle) {
    this.lifecycleHooks[lifecycle].forEach(hook => hook());
  }

  public render(abstractChildren: ApplicationElement) {
    if (this.mounted) {
      if (this.rendered) {
        reconcile(abstractChildren, this);
      } else {
        this.rendered = factory(abstractChildren, this, () => this.getPredecessor(), this.renderOptions);
        this.rendered.initialiseNestedElements();
      }
    } else {
      this.throwNotMountedError();
    }
  }

  private throwNotMountedError(): never {
    throw new Error('Can\'t render new content, the component got unmounted');
  }

  public getLastIntrinsicInstance() {
    return this.rendered.getLastIntrinsicInstance();
  }

  /**
   * updates the shadowdom and dom
   */
  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    this.storeProps.dispatch(newAbstractElement.props as componentProps);
  }

  /**
   * moves the children to another dom position
   */
  public move(predecessor: predecessor<HostElement, HostTextElement>) {
    this.rendered.move(predecessor);
  }

  /**
   * removes the children from the dom
   */
  public remove(prepareRemoveSelf: boolean) {
    this.applicationInstance.componentWillUnmount(this.props, this);
    this.executeLifecycleHooks('componentWillUnmount');
    this.mounted = false;

    if (this.rendered) {
      this.rendered.remove(prepareRemoveSelf);
    }
  }
}
