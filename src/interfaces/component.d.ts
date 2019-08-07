import ComponentInstance from '../instances/types/Component/Instance';
import PlusnewAbstractElement from '../PlusnewAbstractElement';

export type ApplicationElement =
  | PlusnewAbstractElement
  | string
  | number
  | boolean
  | null
  | undefined
  | (PlusnewAbstractElement | string | number | boolean | null | undefined)[];

export type props = {
  [key: string]: unknown;
  key?: number | string;
  children: any[];
};

/**
 * thats how a application component should look like
 */
export default interface Component<componentProps extends Partial<props> = {} > {
  (props: componentProps, componentInstance: ComponentInstance<componentProps, unknown, unknown>): ApplicationElement;
}
