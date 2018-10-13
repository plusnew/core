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

export interface props {
  [key: string]: unknown;
  key?: number | string;
  children: ApplicationElement[];
}

/**
 * thats how a application component should look like
 */
export default interface component<componentProps extends Partial<props> = {} > {
  (props: componentProps, componentInstance: ComponentInstance<componentProps>): ApplicationElement;
}
