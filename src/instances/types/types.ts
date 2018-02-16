/**
 * The different types of Instances: document.createElement, new ComponentHandler(), document.createTextNode
 */
enum InstanceTypes {
  Dom,
  Array,
  Text,
  Placeholder,
  Component,
  Root,
  Fragment,
}

export default InstanceTypes;
