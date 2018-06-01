import { store } from 'redchain';
import ComponentInstance from '../instances/types/Component/Instance';
import PlusnewAbstractElement from '../PlusnewAbstractElement';

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
  key?: number | string;
  children: ApplicationElement[];
}

export interface deps {
  [key: string]: store<any, any>;
}

export interface options<props, deps> {
  [key: string]: any;
  instance: ComponentInstance;
  componentWillUnmount?: (props: props, deps: deps) => void;
}

export type constructor<props, componentDependencies extends deps> = (props: props, options: options<props, componentDependencies>) => componentDependencies;

export type render<props> = (props: props, deps: deps, options: options<props, any>) => plusnew.JSX.Element | null;

/**
 * thats how a application component should look like
 */
export default interface component<props = {}> {
  (props: props, componentInstance: ComponentInstance): ApplicationElement;
}
