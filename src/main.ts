/*global tempart_parser_parser, tempart_compiler_compiler, tempart_version, module, window */
import ConfigInterface from './Interface/Config';
import ComponentHandler from './Component/Handler';
import Config from './Core/Config';

class Main {
  _componentHandler: ComponentHandler
  _config: Config

  constructor(config: ConfigInterface) {
    this._config = new Config(config);
    this._componentHandler = new ComponentHandler(this._config);
    
  }

  getHtml(): string {
    let mainComponent = this._componentHandler.create(this._config.getMainPath(), this._config.getMainArgs());
    return "foo";
  }
}

(<any>window).Snew = Main;
