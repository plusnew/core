import component, { props } from 'interfaces/component';
export default class PlusnewAbstractElement {
    /**
     * The information if what domnode it is, or if it is a component
     */
    type: string | component<any>;
    /**
     * what properties should your parent give you
     */
    props: props;
    /**
     * Lightweight representation of a DOM or Component Node, this component is immutable and is used for comparison
     */
    constructor(type: string | component<any>, props: {} | null, children: PlusnewAbstractElement[]);
    /**
     * sets the information what domnode or component this is
     */
    private setType(type);
    /**
     * sets the props given from the parent
     */
    private setProps(props, children);
    /**
     * Checks if the key is a custom element and checks for vulnerable values
     */
    shouldAddPropToElement(key: string): boolean;
}
