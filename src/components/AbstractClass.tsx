import type ComponentInstance from "../instances/types/Component/Instance";
import type Instance from "../instances/types/Instance";
import types from "../instances/types/types";
import type { ApplicationElement, props } from "../interfaces/component";
import type { Observer } from "../util/store";

function hasComponent<HostElement, HostTextElement>(
  instance?: Instance<HostElement, HostTextElement>
): boolean {
  if (!instance) {
    return false;
  }
  if (instance.nodeType === types.Component) {
    return true;
  }

  return hasComponent(instance.parentInstance);
}

export default abstract class Component<
  componentProps extends Partial<props & { children: any }>,
  HostElement = unknown,
  HostTextElement = unknown
> {
  static displayName = "";

  constructor(
    _props: componentProps,
    _componentInstance: ComponentInstance<
      componentProps,
      HostElement,
      HostTextElement
    >
  ) {}

  abstract render(
    props: Observer<componentProps>,
    plusnewComponentInstance: ComponentInstance<
      componentProps,
      HostElement,
      HostTextElement
    >
  ): ApplicationElement;

  componentWillUnmount(
    _props: componentProps,
    _plusnewComponentInstance: ComponentInstance<
      componentProps,
      HostElement,
      HostTextElement
    >
  ) {}

  static shouldCreateComponent<HostElement, HostTextElement>(
    parentInstance: Instance<HostElement, HostTextElement>
  ) {
    return (
      parentInstance.renderOptions.createChildrenComponents !== false ||
      hasComponent(parentInstance) === false
    );
  }
}
