/**
 * The different types of Instances: document.createElement, new ComponentHandler(), document.createTextNode
 */
enum InstanceTypes {
  Dom = 'host',
  Array = 'array',
  Text = 'text',
  Placeholder = 'placeholder',
  Component = 'function',
  Root = 'root',
  Fragment = 'fragment',
}

export default InstanceTypes;
