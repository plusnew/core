import PlusnewAbstractElement from 'PlusnewAbstractElement';
import { props } from '../../../interfaces/component';
import { hasInputEvent, hasOnchangeEvent, isCheckbox, isOption, isRadio, isSelect } from '../../../util/dom';
import { getSpecialNamespace } from '../../../util/namespace';
import ChildrenInstance from '../ChildrenInstance';
import Instance, { getPredeccessor, predecessor } from '../Instance';
import types from '../types';
import reconcile from './reconcile';
import { renderOptions } from '../../../interfaces/renderOptions';

const PropToAttribbuteMapping = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv',
};

/**
 * DomInstances are representations of <div />
 * or when plusnew.createElement gets called with a string
 * these can be html-elements but also svg elements
 * the DomInstance sets the attributes and properties in the dom
 * and takes care of EventHandlers
 *
 * it also fires events like elementDidMount and elementWillUnmount
 */
export default class DomInstance extends ChildrenInstance {
  public nodeType = types.Dom;
  public ref: Element;
  public props: props;
  public executeChildrenElementWillUnmount = false;

  constructor(
    abstractElement: PlusnewAbstractElement,
    parentInstance: Instance,
    predecessor: getPredeccessor,
    renderOptions: renderOptions,
  ) {
    super(abstractElement, parentInstance, predecessor, renderOptions);
    this.type = abstractElement.type;
    this.props = abstractElement.props;
    this.setNamespace();

    if (this.renderOptions.xmlns) {
      this.ref = document.createElementNS(this.renderOptions.xmlns, abstractElement.type as string);
    } else {
      this.ref = document.createElement(abstractElement.type as string);
    }

    this.setProps();
    this.appendToParent(this.ref, predecessor());
  }

  initialiseNestedElements() {
    this.addChildren();
    // Autofocus call has to happen, after it got appended to parent, and after children are added
    // Some browsers ignore element.focus() when it is not yet added to the document
    this.setAutofocusIfNeeded();
    // Value on OPTION-Element has to be set, after SELECT-Children are available
    this.setSelectedIfNeeded();
    this.elementDidMountToParent();
    this.setOnChangeEvent();
  }

  /**
   * this function gets called from the children, when a intrinsic-element gets created
   * this will not get proxied above, dom-instances stops the bubbling of such an event
   */
  public elementDidMount() {}

  /**
   * this function gets called from the children, when a intrinsic-element gets deleted
   * this will not get proxied above, dom-instances stops the bubbling of such an event
   */
  public elementWillUnmount() {}

  /**
   * this function gets called, to determine predecessors from siblings, since this is an actualdom element
   * the reference to self should be returned
   */
  public getLastIntrinsicElement() {
    return this.ref;
  }

  /**
   * for the children of this dom instance, there is no predecessor, because dom-instance is an actual element
   */
  public getChildrenPredeccessor() {
    return null;
  }

  /**
   * sets a special namespace, in case self is an svg, so that children will created with correct namespace
   */
  private setNamespace() {
    const currentNamespace = this.props.xmlns as string || getSpecialNamespace(this.type as string) || this.renderOptions.xmlns;
    if (currentNamespace !== this.renderOptions.xmlns) {
      this.renderOptions = {
        ...this.renderOptions,
        xmlns: currentNamespace,
      };
    }
  }

  /**
   * safari is the only browser creating a focus on elements created after time
   * all the other browsers don't do that, that's why this functions sets it manually, after the element is inserted in the dom
   */
  private setAutofocusIfNeeded() {
    if (this.props.autofocus === true) {
      (this.ref as HTMLElement).focus();
    }
  }

  /**
   * sets the value of an OPTION-Element
   * looks for the parent select element to set the selected property
   * the select.value is not used, because option elements could be added asynchronously
   * and browsers dont care about that properly
   */
  private setSelectedIfNeeded() {
    if (isOption(this.type)) {
      const select = this.findParent(this.parentInstance, (instance) => {
        if (instance instanceof DomInstance) {
          if (isSelect(instance.type)) {
            return true;
          }
          throw new Error(`Nearest dom of OPTION is not a SELECT but a ${instance.type.toString().toUpperCase()}`);
        }
        return false;
      });

      if (!select) {
        throw new Error('Could not find SELECT-ELEMENT of OPTION');
      }
      this.setProp('selected', this.props.value === (select as DomInstance).props.value);
    }
  }

  /**
   * calls recursively a callback with the instance until the callback returns true
   * if callback returns false, the parentInstance is called
   * if arrived at root, and no instance got found, undefined will be returned
   */
  private findParent(instance: Instance | undefined, callback: (instance: Instance) => boolean): Instance | void {
    if (instance !== undefined) {
      if (callback(instance) === true) {
        return instance;
      }
      return this.findParent(instance.parentInstance, callback);
    }
  }

  /**
   * sets the attributes to the element
   */
  private setProps() {
    for (const index in this.props) {
      this.setProp(index, this.props[index]);
    }
  }

  /**
   * sets the actual property on the element
   */
  public setProp(key: string, value: any) {
    const keyName = this.getAttributeNameFromProp(key);
    if (this.ignoreProperty(key)) {
      // When its an internal property, it should not be set to dom element
    } else if (typeof value === 'function') {
      (this.ref as any)[keyName] = value;
    } else if (key === 'style') {
      // style gets set as a attribute, not by property
      // because of better debuggability when set by this way
      // When an invalid property gets set, the browser just sucks it up and ignores it without errors
      this.ref.setAttribute(keyName, this.getStylePropsAsAttribute(value));
    } else {
      // All the other attributes are strings
      if (this.setAttributeAsProperty(keyName)) {
        // input-values need to be set directly as property, for overwriting purpose of browser behaviour
        (this.ref as any)[keyName] = value;
      } else if (value === false) {
        // @FIXME removing namespaced attributes needs to be implemented
        this.ref.removeAttribute(keyName);
      } else {
        if (keyName.indexOf(':') === -1) {
          this.ref.setAttribute(keyName, `${value}`);
        } else {
          const [namespacePrefix, namespacedKeyName] = keyName.split(':');
          if (namespacePrefix === 'xmlns') {
            this.renderOptions = {
              ...this.renderOptions,
              xmlnsPrefixes: {
                ...this.renderOptions.xmlnsPrefixes,
                [namespacedKeyName]: value,
              },
            };
          } else {
            if (this.renderOptions && this.renderOptions.xmlnsPrefixes && typeof this.renderOptions.xmlnsPrefixes[namespacePrefix] !== undefined) {
              this.ref.setAttributeNS(this.renderOptions.xmlnsPrefixes[namespacePrefix] as string, namespacedKeyName, `${value}`);
            } else {
              throw new Error(`The namespace prefix ${namespacePrefix} is not defined`);
            }
          }
        }
      }
    }
  }

  private setOnChangeEvent() {
    if (hasOnchangeEvent(this.type, this.props)) {
      const onchangeWrapper = (evt: Event) => {
        let preventDefault = true;
        let changeKey: 'value' | 'checked' = 'value';
        if (isCheckbox(this.type, this.props) || isRadio(this.type, this.props)) {
          changeKey = 'checked';
        }

        this.setProp = (key, value) => {
          if (key === changeKey && (evt.target as HTMLInputElement)[changeKey] === value) {
            preventDefault = false;
          } else {
            DomInstance.prototype.setProp.call(this, key, value);
            preventDefault = true;
          }

          return;
        };

        if (this.props.onchange) {
          (this.props.onchange as EventListener)(evt);
        }

        if (preventDefault === true) {
          ((this.ref as HTMLInputElement)[changeKey] as any) = this.props[changeKey];
        }

        delete this.setProp;
      };

      if (hasInputEvent(this.type, this.props)) {
        (this.ref as HTMLElement).oninput = onchangeWrapper;
      } else {
        (this.ref as HTMLElement).onchange = onchangeWrapper;
      }
    }

    return;
  }

  /**
   * some properties are plusnew-internally, these should not be set on the actual intrinsic-element
   */
  private ignoreProperty(key: string) {
    return (
      key === 'key' ||
      key === 'children' ||
      (key === 'onchange' && hasOnchangeEvent(this.type, this.props))
    );
  }

  /**
   * determines if the property should be set as property, or as attribute
   * value properties can't be set as attribute, when updating because then the browser mostly ignores it
   * for all the other attributes its better to set them as an attribute, e.g. style is better debuggable as a attribute
   * browsers tend to ignore invalid setted values, and don't show it in the inspectors
   */
  private setAttributeAsProperty(keyName: string) {
    return keyName === 'value' || keyName === 'checked';
  }

  /**
   * deletes a property from dom element
   */
  public unsetProp(key: string) {
    const keyName = this.getAttributeNameFromProp(key);

    if (typeof (this.ref as any)[keyName] === 'function') {
      (this.ref as any)[keyName] = null;
    } else {
      this.ref.removeAttribute(this.getAttributeNameFromProp(key));
    }
  }

  /**
   * sets all the style attributes
   */
  private getStylePropsAsAttribute(style: {[styleIndex: string]: string}): string {
    return Object.keys(style).reduce((styleString, styleIndex) => `${styleString}${styleIndex}:${style[styleIndex]};`, '');
  }

  /**
   * gets the correct attributename, className gets to class etc
   */
  private getAttributeNameFromProp(key: string): string {
    if (PropToAttribbuteMapping.hasOwnProperty(key)) {
      return (PropToAttribbuteMapping as any)[key];
    }
    return key;
  }

  /**
   * by the children should add themselfs to our element
   */

  public appendChild(element: Node, predecessor: predecessor) {
    this.insertBefore(this.ref, element, predecessor);
  }

  /**
   * moves the domnode to another place
   */
  public move(predecessor: predecessor) {
    this.insertBefore(this.ref.parentNode as Node, this.ref, predecessor);
  }

  /**
   * calls the parentInstance that this module got created
   */
  public elementDidMountToParent() {
    (this.parentInstance as Instance).elementDidMount(this.ref);
  }

  /**
   * calls the parentInstance that this module got deleted
   */
  public elementWillUnmountToParent() {
    return (this.parentInstance as Instance).elementWillUnmount(this.ref);
  }

  /**
   * checks if parents want to do stuff with unmounting element, e.g. animate it
   */
  public prepareRemoveSelf() {
    return this.elementWillUnmountToParent();
  }

  /**
   * actually removes this element
   */
  public removeSelf() {
    (this.ref.parentNode as Node).removeChild(this.ref);
  }

  /**
   * updates the shadowdom and dom
   */
  public reconcile(newAbstractElement: PlusnewAbstractElement) {
    reconcile(newAbstractElement.props, this);
  }
}
