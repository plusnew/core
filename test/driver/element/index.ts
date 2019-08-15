import { IDriver } from 'interfaces/driver';

const element: IDriver<Element, Text>['element'] = {
  create: (domInstance) => {
    if (domInstance.renderOptions.xmlns) {
      return document.createElementNS(domInstance.renderOptions.xmlns, domInstance.type);
    }
    return document.createElement(domInstance.type);
  },
  remove: (domInstance) => {
    domInstance.ref.remove();
  },
  setAttribute: (domInstance, attributeName, attributeValue) => {

  },
  moveBeforeSibling: (self, previousSiblingInstance) => {
    if (self.ref.parentElement) {
      self.ref.parentElement.insertBefore(self.ref, previousSiblingInstance && previousSiblingInstance.ref);
    } else {
      throw new Error('Could not move orphaned node');
    }
  },
  appendChildBeforeSibling: (parentInstance, childInstance, previousSiblingInstance) => {
    parentInstance.ref.insertBefore(childInstance.ref, previousSiblingInstance && previousSiblingInstance.ref);
  },
  elementDidMountHook: (domInstance) => {

  },
};

export default element;
