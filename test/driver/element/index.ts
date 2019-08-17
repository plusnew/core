import { IDriver } from 'interfaces/driver';

function insertAfter(parentElement: Element, childElement: Element | Text, refChild: Element | Text | null) {
  if (refChild === null) {
    parentElement.insertBefore(childElement, parentElement.firstChild);
  } else {
    parentElement.insertBefore(childElement, refChild.nextSibling);
  }
}

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
  moveAfterSibling: (self, previousSiblingInstance) => {
    if (self.ref.parentElement) {
      insertAfter(self.ref.parentElement, self.ref, previousSiblingInstance && previousSiblingInstance.ref);
    } else {
      throw new Error('Could not move orphaned node');
    }
  },
  appendChildAfterSibling: (parentInstance, childInstance, previousSiblingInstance) => {
    insertAfter(parentInstance.ref, childInstance.ref, previousSiblingInstance && previousSiblingInstance.ref);
  },
  elementDidMountHook: (domInstance) => {

  },
};

export default element;
