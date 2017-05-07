import Handler from './Handler';
import TemplateInterface from '../Interface/Template';

class Class {
  _handler: Handler
  _template: TemplateInterface
  _state: object
  _uid: number

  constructor(uid: number, path: string, handler: Handler) {
    this._state = {};
    this._uid = uid;
    this._handler = handler;
    let TemplateClass = handler._getTemplate(path);
    this._template = new TemplateClass(this._uid + '-');
  }

  setState(state: any) {
    this._state = state;
  }

  set(key: Array<string>, value: any) {

  }

  _getHtml(): string {
    // @TODO add init-flag
    return this._template.clean(this._state).html;
  }
}

export default Class;