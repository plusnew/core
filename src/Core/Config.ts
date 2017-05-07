import ConfigInterface from '../Interface/Config';

class Config{
  _config: ConfigInterface

  constructor(config: ConfigInterface) {
    this._config = config;
  }

  getMainPath(): string {
    return this._config.mainPath;
  }

  getMainArgs(): object {
    if('mainArgs' in this._config) {
      return this._config.mainArgs;
    } else {
     return {}; 
    }
  }

  getComponentClass(path: string): any {
    if(path in this._config.components) {
      return (<any>this._config.components)[path];
    } else {
      throw new Error('No such component ' +path);
    }
    
  }
}

export default Config;
