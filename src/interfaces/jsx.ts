import PlusnewAbstractElement from '../PlusnewAbstractElement';

declare global {
  namespace plusnew {
    namespace JSX {
      /**
       * the JSX.Element is a abstract representation of a Component
       */
      interface Element extends PlusnewAbstractElement {}

      interface ElementChildrenAttribute {
        // @FIXME children are always arrays, but typescript doesn't accept that because of react
        children: {};
      }

      /**
       * All the DOM Nodes are here
       */
      interface IntrinsicElements {
      }

      interface IntrinsicAttributes {
        key?: string | number;
      }
    }
  }
}
