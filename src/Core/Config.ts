import ConfigInterface from '../Interface/Config';
import ComponentInterface from '../Interface/Component';
import TemplateInterface from '../Interface/Template';

const DEFAULTS = {
  rootPath: 'main/app',
  rootArgs: {},
  insertInDom: true,
}

class Config{
  _config: ConfigInterface

  constructor(config: ConfigInterface) {
    this._config = config;
  }

  _hasKey(key: string): boolean {
    return key in this._config;
  }

  getRootPath(): string {
    return this._hasKey('rootPath') ? this._config.rootPath : DEFAULTS.rootPath;
  }

  getRootElement(): HTMLElement {
    return this._config.rootElement;
  }

  getRootArgs(): object {
    return this._hasKey('rootArgs') ? this._config.rootArgs : DEFAULTS.rootArgs;
  }

  getComponentClass(path: string): typeof ComponentInterface {
    if(path in this._config.components) {
      return (<any>this._config.components)[path];
    } else {
      throw new Error('No such component ' +path);
    }
  }

  getTemplateClass(path: string): typeof TemplateInterface {
    if(path in this._config.templates) {
      return (<any>this._config.templates)[path];
    } else {
      throw new Error('No such template ' +path);
    }
  }

  insertInDom(): boolean {
    return this._hasKey('insertInDom') ? this._config.insertInDom : DEFAULTS.insertInDom;
  }
}

export default Config;
