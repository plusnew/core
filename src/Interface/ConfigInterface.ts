import ComponentInterface from './ComponentInterface';
import TemplateInterface from './TemplateInterface';

interface Config {
  components: {
    [key: string]: typeof ComponentInterface;
  };

  templates: {
    [key: string]: typeof TemplateInterface;
  };
}

export default Config;
