import PlusnewAbstractElement from '../PlusnewAbstractElement';

declare global {
  namespace JSX {
    /**
     * the JSX.Element is a abstract representation of a Component
     */
    interface Element extends PlusnewAbstractElement { }
    /**
     * All the DOM Nodes are here
     */
    interface IntrinsicElements {
      [elementName: string]: any;
    }

    interface IntrinsicAttributes {
      key?: string | number;
    }
  }
}
