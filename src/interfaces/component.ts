import { store } from 'redchain';
import PlusnewAbstractElement from '../PlusnewAbstractElement';

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

export interface componentResult<props, deps> {
  render: (props: props, deps: deps) => ApplicationElement;
  dependencies: deps;
}

/**
 * thats how a application component should look like
 */
export default interface component<props = {}, deps = deps> {
  (props: props): componentResult<props, deps>;
}
