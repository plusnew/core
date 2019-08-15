import { IDriver } from 'interfaces/driver';

function insertBefore(parentElement: Element, childElement: Element | Text, refChild: Element | Text | null) {
  if (refChild === null) {
    parentElement.insertBefore(childElement, parentElement.firstChild);
  } else {
    parentElement.insertBefore(childElement, refChild.nextSibling);
  }
}

const text: IDriver<Element, Text>['text'] = {
  create: text => document.createTextNode(text),
  remove: (textInstance) => {
    textInstance.ref.remove();
  },
  update: (textInstance, newText) => {
    textInstance.ref.textContent = newText;
  },
  moveBeforeSibling: (self, previousSiblingInstance) => {
    if (self.ref.parentElement) {
      insertBefore(self.ref.parentElement, self.ref, previousSiblingInstance && previousSiblingInstance.ref);
    } else {
      throw new Error('Could not move orphaned node');
    }
  },
};

export default text;
