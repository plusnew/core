import { IDriver } from 'interfaces/driver';

const text: IDriver<Element, Text>['text'] = {
  create: text => document.createTextNode(text),
  remove: (textInstance) => {
    textInstance.ref.remove();
  },
  update: (textInstance, newText) => {
    textInstance.ref.textContent = newText;
  },
};

export default text;
