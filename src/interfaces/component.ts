import PlusnewAbstractElement from '../PlusnewAbstractElement';
import { store } from 'redchain';
import ComponentInstance from '../instances/types/Component/Instance';

export type ApplicationElement = PlusnewAbstractElement |
                                 string |
                                 number |
                                 boolean |
                                 null |
                                 undefined |
                                 (PlusnewAbstractElement | string | number | boolean | null | undefined)[];

export interface props {
  [key: string]: any;
  children: ApplicationElement[];
}

export interface deps {
  [key: string]: store<any, any>;
}

export type render<props> = (props: props, deps: deps) => JSX.Element | null;

/**
 * thats how a application component should look like
 */
export default interface component<props = {}> {
  (props: props, componentInstance: ComponentInstance): ApplicationElement;
}
