import ContainerClass from './ContainerClass';
import Config from '../Core/Config';
import TemplateInterface from '../Interface/Template';
import ComponentInterface from '../Interface/Component';

class Handler {
  _uid: number
  _config: Config
  _containerInits: Array<ContainerClass>

  constructor(config: Config) {
    this._config         = config;
    this._containerInits = [];
    this._uid            = 0;
  }

  create(path: string, args: any): ContainerClass {
    let componentContainer = this._createComponentContainer(path);
    var ComponentClass = this._getComponentClass(path);
    componentContainer._setComponent(new ComponentClass(componentContainer));
    return componentContainer;
  }

  _createComponentContainer(path: string): ContainerClass {
    const uid = this._incrementUid();
    return new ContainerClass(uid, path, this);
  }

  _incrementUid(): number {
    this._uid++;
    return this._uid;
  }

  _getComponentClass(path: string): typeof ComponentInterface {
    return this._config.getComponentClass(path);
  }

  _getTemplate(path: string): typeof TemplateInterface {
    return this._config.getTemplateClass(path);
  }

  _pushContainerInit(containerClass: ContainerClass): Handler {
    this._containerInits.push(containerClass);
    return this;
  }

  _executeContainerInits(): boolean {
    let calledInits = false;
    while(this._containerInits.length) {
      const component = this._containerInits.pop()._getComponent();
      if(component.init) { // This may needs some try catch stuff
        component.init();
        calledInits = true;
      }
    }
    return calledInits;
  }

  _getConifg(): Config {
    return this._config;
  }
}

export default Handler;
