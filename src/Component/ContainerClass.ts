import Handler from './Handler';
import TemplateInterface from '../Interface/Template';
import ComponentInterface from '../Interface/Component';
import util from '../Core/util';

class ContainerClass {
  _handler:   Handler
  _component: ComponentInterface
  _template:  TemplateInterface
  _state:     any
  _uid:       number
  _compiled:  boolean

  constructor(uid: number, path: string, handler: Handler) {
    let TemplateClass = handler._getTemplate(path);
    this._state       = null;
    this._uid         = uid;
    this._handler     = handler;
    this._compiled    = false;    
    this._template    = new TemplateClass(this._uid + '-');
  }

  setState(state: any) {
    this._state = state;
  }

  set(key: Array<string>, value: any): boolean {
    let changed = false;
    var state = util.getReference(this._state, key); 
    if(state[key[key.length - 1]] !== value) {
      state[key[key.length - 1]] = value;
      changed = true;
    }
    return changed;
  }

  _setComponent(component: ComponentInterface): ContainerClass {
    this._component = component;
    return this;
  }

  _getComponent(): ComponentInterface {
    return this._component;
  }

  _compileTemplate(): string {
    // @TODO add init-flag
    if(this._compiled && this._handler._getConifg().insertInDom()) {
      throw new Error('Thats not yet implemented');
    } else {
      var html       = this._template.clean(this._state).html;
      if(this._compiled === false) {
        this._handler._pushContainerInit(this);
      }
      this._compiled = true;
      
      return html;
    }
  }
}

export default ContainerClass;