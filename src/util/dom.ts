import { props } from '../interfaces/component';
import { PlusnewElement } from '../PlusnewAbstractElement';

export function isInputElement(type: PlusnewElement, props: props) {
  return type === 'input';
}

export function isTextArea(type: PlusnewElement) {
  return type === 'textarea';
}

export function isCheckbox(type: PlusnewElement, props: props) {
  return isInputElement(type, props) && props.type === 'checkbox';
}

export function hasInputEvent(type: PlusnewElement, props: props) {
  return isInputElement(type, props) || isTextArea(type);
}

export function isSelect(type: PlusnewElement) {
  return type === 'select';
}

export function hasOnchangeEvent(type: PlusnewElement, props: props) {
  return isInputElement(type, props) || isTextArea(type) || isSelect(type);
}
