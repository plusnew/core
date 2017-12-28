/**
 * The different types of Instances: document.createElement, new ComponentHandler(), document.createTextNode
 */
declare enum InstanceTypes {
    Dom = 0,
    Array = 1,
    Text = 2,
    Component = 3,
    Root = 4,
}
export default InstanceTypes;
