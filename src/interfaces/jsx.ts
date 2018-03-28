import PlusnewAbstractElement from '../PlusnewAbstractElement';

declare global {
  namespace plusnew {
    namespace JSX {
      /**
       * the JSX.Element is a abstract representation of a Component
       */
      interface Element extends PlusnewAbstractElement {}

      interface ElementChildrenAttribute {
        children: {};
      }

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
}
