import { PlusnewElement } from '../PlusnewAbstractElement';
import { props } from '../interfaces/component';

export function isInputElement(type: PlusnewElement, props: props) {
  return type === 'input';
}

export function isTextInput(type: PlusnewElement, props: props) {
  return isInputElement(type, props) && (props.type === undefined || props.type === 'text');
}

export function isTextArea(type: PlusnewElement, props: props) {
  return type === 'textarea';
}

export function hasInputEvent(type: PlusnewElement, props: props) {
  return isTextInput(type, props) || isTextArea(type, props);
}

export function hasOnchangeEvent(type: PlusnewElement, props: props) {
  return isInputElement(type, props) || isTextArea(type, props);
}
