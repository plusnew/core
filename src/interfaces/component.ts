import store from 'store';
import PlusnewAbstractElement from 'PlusnewAbstractElement';

export type ApplicationElement = PlusnewAbstractElement | (PlusnewAbstractElement | string)[] | string;

export interface props {
  [key: string]: any;
  children: ApplicationElement[];
}

export interface deps {
  [key: string]: store<any, any>;
}

/**
 * thats how a application component should look like
 */
export default interface component<props = {}, deps = {}> {
  (props: props): {
    render: (props: props, deps: deps) => ApplicationElement;
    dependencies: deps;
  };
}
