import PlusnewAbstractElement from 'PlusnewAbstractElement';
import ComponentHandler from 'ComponentHandler';

type ApplicationElement = PlusnewAbstractElement | (PlusnewAbstractElement | string)[] | string;

/**
 * The different types of Instances: document.createElement, new ComponentHandler(), document.createTextNode
 */
enum InstanceTypes {
  Dom,
  Text,
  Component,
}
/**
 * ref for the actual DOMElements
 */
interface DomInstance {
  type: InstanceTypes.Dom;
  ref: Element;
  children: Instance[];
}

/**
 * ref for a component, is needed for containering
 */
interface TextInstance {
  type: InstanceTypes.Text;
  ref: Text;
}

/**
 * ref for a component, is needed for containering
 */
interface ComponentInstance {
  type: InstanceTypes.Component;
  ref: ComponentHandler;
  children: Instance[];
}

/**
 * The createElement can be called with a domnode, a component, or a text
 */
type Instance = ComponentInstance | DomInstance | TextInstance;

export default class DomHandler {
  /**
   * the actual dom nodes are preserved here
   */
  public refs: Instance[];

  /**
   * cheap immutable element representation is saved here, for checking what should be updated
   */
  private currentAbstractElements: ApplicationElement;

  /**
   * the DomHandler is the HTML-Abstraction handler for manipulation
   */
  constructor(elements: ApplicationElement) {
    this.initialiseRefs()
        .setCurrentAbstractElements(elements);
  }

  /**
   * creates empty array, for the instances of the domelements and the componentInstances
   */
  private initialiseRefs() {
    this.refs = [];

    return this;
  }
  /**
   * saves the current version of the dom elements
   */
  private setCurrentAbstractElements(elements: ApplicationElement) {
    this.currentAbstractElements = elements;

    return this;
  }

  /**
   * creates the actual HTMLElements based on the abstract version of currentAbstractElements
   */
  public renderInitialDom() {
    if (Array.isArray(this.currentAbstractElements)) {
      this.refs = this.createElements(this.currentAbstractElements);
    } else {
      this.refs = [this.createElement(this.currentAbstractElements)];
    }
  }

  /**
   * goes through all abstractElements and creates new ones
   */
  private createElements(abstractElements: (PlusnewAbstractElement|string)[]): Instance[] {
    return abstractElements.map((abstractElement) => {
      return this.createElement(abstractElement);
    });
  }

  /**
   * creates the actual domnodes and its childnodes
   */
  private createElement(abstractElement: PlusnewAbstractElement | string): Instance {
    if (typeof(abstractElement) === 'string') {
      return {
        type: InstanceTypes.Text,
        ref: document.createTextNode(abstractElement),
      };
    } else if (typeof(abstractElement.type) === 'string') {
      return this.createDomElement(abstractElement);
    } else {
      return {
        type: InstanceTypes.Component,
        children: [],
        ref: new ComponentHandler(abstractElement.type, abstractElement.props),
      };
    }
  }

  private createDomElement(abstractElement: PlusnewAbstractElement) {
    const result: DomInstance = {
      type: InstanceTypes.Dom,
      children: [],
      ref: document.createElement(abstractElement.type as 'string'),
    };
    
    for (const propsIndex in abstractElement.props) {
      if (abstractElement.props.hasOwnProperty(propsIndex)) {
        if (propsIndex === 'children') {
          result.children = this.createElements(abstractElement.props.children);
          result.children.forEach((child) => {
            if (child.type === InstanceTypes.Component) {

            } else {
              result.ref.appendChild(child.ref);
            }
          });
        } else {
          (<any>result.ref)[propsIndex] = abstractElement.props[propsIndex];
        }
      }
    }

    return result;
  }

  /**
   * throws exception when an attack is assumed
   * if returned false, it will silently not create the element
   */
  // private shouldCreateElement(type: string) {
  //   // @TODO add whitelisting for XSS protection
  //   return true;
  // }

  /**
   * throws exception when an attack is assumed
   * if returned false, it will silently not create the attribute, for example data-test-*
   */
  // private shouldCreateAttribute() {
  //   // @TODO add whitelisting for XSS protection
  //   return true;
  // }

  /**
   * appends the root HTMLElements to the given mount target
   */
  public mount(element: HTMLElement) {
    if (Array.isArray(this.currentAbstractElements)) {
      for (let index = 0; index < this.refs.length; index += 1) {
        this.appendToRoot(this.refs[index], element);
      }
    } else {
      this.appendToRoot(this.refs[0], element);
    }
  }

  /**
   * handles the different instancetype
   * when dom element then append it directly
   * when its another component, tell the domhandler of this component to mount itself
   */
  private appendToRoot(ref: Instance, element: HTMLElement) {
    if (ref.type === InstanceTypes.Dom) {
      element.appendChild(ref.ref as Element);
    } else {
      const component = ref.ref as ComponentHandler;
      component.domHandler.mount(element);
    }
  }

  /**
   * removes all childNodes
   */
  public removeChildren(parentElement: HTMLElement) {
    for (let index = parentElement.childNodes.length; index > 0; index -= 1) {
      parentElement.removeChild(parentElement.childNodes[index - 1]);
    }
  }
}
