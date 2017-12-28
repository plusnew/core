import types from '../types';
import Instance from '../Instance';
export default class RootInstance extends Instance {
    type: types;
    ref: Element;
    /**
     * appends the element to the rootcontainer
     */
    appendChild(element: Element): this;
    /**
     * Root is no child of nobody, because of that nobody should care how long it is
     */
    getLength(): number;
    /**
     * Nobody is above the root, and because of that nobody is able to remove the root
     */
    remove(): Instance;
}
