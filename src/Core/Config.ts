import ConfigInterface from '../Interface/Config';
import ComponentInterface from '../Interface/Component';
import TemplateInterface from '../Interface/Template';

class Config{
  _config: ConfigInterface

  constructor(config: ConfigInterface) {
    this._config = config;
  }

  getRootPath(): string {
    return this._config.rootPath;
  }

  getRootArgs(): object {
    if('rootArgs' in this._config) {
      return this._config.rootArgs;
    } else {
     return {}; 
    }
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
}

export default Config;
