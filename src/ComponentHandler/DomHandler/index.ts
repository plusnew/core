import PlusnewAbstractElement from 'PlusnewAbstractElement';
import ComponentHandler from 'ComponentHandler';

interface DomInstance {
  type: 'dom';
  ref: Element;
  children?: (DomInstance|ComponentInstance)[];
}

interface ComponentInstance {
  type: 'component';
  ref: ComponentHandler;
  children?: (DomInstance|ComponentInstance)[];
}

export default class DomHandler {
  /**
   * the actual dom nodes are preserved here
   */
  public refs: (DomInstance|ComponentInstance)[];

  /**
   * cheap immutable element representation is saved here, for checking what should be updated
   */
  private currentAbstractElements: PlusnewAbstractElement | PlusnewAbstractElement[];

  /**
   * the DomHandler is the HTML-Abstraction handler for manipulation
   */
  constructor(elements: PlusnewAbstractElement | PlusnewAbstractElement[]) {
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
  private setCurrentAbstractElements(elements: PlusnewAbstractElement | PlusnewAbstractElement[]) {
    this.currentAbstractElements = elements;

    return this;
  }

  /**
   * creates the actual HTMLElements based on the abstract version of currentAbstractElements
   */
  public renderInitialDom() {
    if (Array.isArray(this.currentAbstractElements)) {
      this.createElements(this.currentAbstractElements, this.refs);
    } else {
      this.createElement(this.currentAbstractElements, this.refs);
    }
  }

  /**
   * goes through all abstractElements and creates new ones
   */
  private createElements(abstractElements: PlusnewAbstractElement[], refs: (DomInstance|ComponentInstance)[]) {
    return abstractElements.map((abstractElement) => {
      return this.createElement(abstractElement, refs);
    });
  }

  /**
   * creates the actual domnodes and its childnodes
   */
  private createElement(abstractElement: PlusnewAbstractElement, refs: (DomInstance|ComponentInstance)[]) {
    if (typeof(abstractElement.type) === 'string') {
      const element = document.createElement(abstractElement.type);


      for (const propsIndex in abstractElement.props) {
        if (abstractElement.props.hasOwnProperty(propsIndex)) {
          (<any>element)[propsIndex] = abstractElement.props[propsIndex];
        }
      }
      
      refs.push({
        type: 'dom',
        ref: element,
      });
    }
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
  private appendToRoot(ref: DomInstance | ComponentInstance, element: HTMLElement) {
    if (ref.type === 'dom') {
      element.appendChild(ref.ref as Element);
    } else {
      const component = ref.ref as ComponentHandler;
      component.domHandler.mount(element);
    }
  }

  public removeChildren(parentElement: HTMLElement) {
    for (let index = parentElement.childNodes.length; index > 0; index -= 1) {
      parentElement.removeChild(parentElement.childNodes[index - 1]);
    }
  }
}
