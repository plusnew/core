import ComponentInterface from './ComponentInterface';
import { Template } from 'tempart';

interface Config {
  components: {
    [key: string]: typeof ComponentInterface;
  };

  templates: {
    [key: string]: typeof Template;
  };
}

export default Config;
