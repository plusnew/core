import PlusnewAbstractElement from '../PlusnewAbstractElement';

export function isInputElement(element: PlusnewAbstractElement) {
  return element.type === 'input';
}

export function isTextInput(element: PlusnewAbstractElement) {
  return isInputElement(element) && (element.props.type === undefined || element.props.type === 'text');
}

export function isTextArea(element: PlusnewAbstractElement) {
  return element.type === 'textarea';
}

export function hasInputEvent(element: PlusnewAbstractElement) {
  return isTextInput(element) || isTextArea(element);
}

export function hasOnchangeEvent(element: PlusnewAbstractElement) {
  return isInputElement(element) || isTextArea(element);
}
