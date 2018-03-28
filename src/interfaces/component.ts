import PlusnewAbstractElement from '../PlusnewAbstractElement';
import { store } from 'redchain';
import ComponentInstance from '../instances/types/Component/Instance';

// @FIXME this is needed to trick typescript into generating .d.ts file
// if a file doesn't export anything other than types, it won't generate the .d.ts file
const nothing = null;
export { nothing };

export type ApplicationElement =
  | PlusnewAbstractElement
  | string
  | number
  | boolean
  | null
  | undefined
  | (PlusnewAbstractElement | string | number | boolean | null | undefined)[];

export interface props {
  [key: string]: any;
  children: ApplicationElement[];
}

export interface deps {
  [key: string]: store<any, any>;
}

export type render<props> = (props: props, deps: deps) => plusnew.JSX.Element | null;

/**
 * thats how a application component should look like
 */
export default interface component<props = {}> {
  (props: props, componentInstance: ComponentInstance): ApplicationElement;
}
