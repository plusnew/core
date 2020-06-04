import type ComponentInstance from "../instances/types/Component/Instance";
import type PlusnewAbstractElement from "../PlusnewAbstractElement";

export type ApplicationElement =
  | PlusnewAbstractElement
  | string
  | number
  | boolean
  | null
  | undefined
  | Promise<ApplicationElement>
  | ApplicationElement[];

export type props = {
  [key: string]: unknown;
  key?: number | string;
  children: any[];
};

/**
 * thats how a application component should look like
 */
export default interface Component<
  componentProps extends Partial<props>,
  HostElement,
  HostTextElement
> {
  (
    props: componentProps,
    componentInstance: ComponentInstance<
      componentProps,
      HostElement,
      HostTextElement
    >
  ): ApplicationElement;
}
