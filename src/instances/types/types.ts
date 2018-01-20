/**
 * The different types of Instances: document.createElement, new ComponentHandler(), document.createTextNode
 */
enum InstanceTypes {
  Dom,
  Array,
  Text,
  PlaceHolder,
  Component,
  Root,
}

export default InstanceTypes;
