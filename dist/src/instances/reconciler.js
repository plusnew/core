"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const types_1 = require("./types/types");
const elementTypeChecker_1 = require("util/elementTypeChecker");
const reconcile_1 = require("./types/Dom/reconcile");
const reconcile_2 = require("./types/Text/reconcile");
const reconcile_3 = require("./types/Component/reconcile");
class Reconciler {
    /**
     * Checks if something changed
     * evaluates if its the same instance, and if it needs an update
     * or if it should be removed and replaced
     */
    update(newAbstractElement, instance) {
        if (this.isSameAbstractElement(newAbstractElement, instance.abstractElement)) {
            if (instance.type === types_1.default.Dom) {
                reconcile_1.default(newAbstractElement, instance);
            }
            else if (instance.type === types_1.default.Text) {
                reconcile_2.default(newAbstractElement, instance);
            }
            else if (instance.type === types_1.default.Component) {
                reconcile_3.default(newAbstractElement, instance);
            }
            else {
                throw new Error('Updating this element is not yet implemented');
            }
            return instance;
        }
        return factory_1.default(newAbstractElement, instance.parentInstance, instance.previousAbstractSiblingCount);
    }
    /**
     * checks if the abstractElements are the same
     */
    isSameAbstractElement(newAbstractElement, oldAbstractElement) {
        return this.isSameAbstractElementType(newAbstractElement, oldAbstractElement);
        // The following code does the key-property check, not yet stable
        // if (this.isSameAbstractElementType(newAbstractElement, oldAbstractElement) === true) {
        //   if (elementTypeChecker.isComponentElement(newAbstractElement) === true || elementTypeChecker.isDomElement(newAbstractElement)) {
        //     if ((newAbstractElement as PlusnewAbstractElement).props.hasOwnProperty('key')) {
        //       if ((oldAbstractElement as PlusnewAbstractElement).props.hasOwnProperty('key')) {
        //         // newAbstractElement and oldAbstractElement, have a key - is it the same?
        //         return (newAbstractElement as PlusnewAbstractElement).props.key === (oldAbstractElement as PlusnewAbstractElement).props.key 
        //       } else {
        //         // newAbstractElement has key, but oldAbstractElement has not
        //         return false;
        //       }
        //     } else if ((oldAbstractElement as PlusnewAbstractElement).props.hasOwnProperty('key')) {
        //       // newAbstractElement has no key, but oldAbstractElement has
        //       return false;
        //     } else {
        //       // newAbstractElement and oldAbstractElement dont have a key, because of that its assumed they are the same
        //       return true;
        //     }
        //   } else {
        //     // newAbstractElement and oldAbstractElement, are either text or array. these are handled the same
        //     return true;
        //   }
        // } else {
        //   // it's not the same type, therefore it can't be the same element
        //   return false;
        // }
    }
    /**
     * checks if the abstractElements are the same type
     */
    isSameAbstractElementType(newAbstractElement, oldAbtractElement) {
        if (elementTypeChecker_1.default.isTextElement(newAbstractElement)) {
            return elementTypeChecker_1.default.isTextElement(oldAbtractElement);
        }
        if (elementTypeChecker_1.default.isArrayElement(newAbstractElement)) {
            return elementTypeChecker_1.default.isArrayElement(oldAbtractElement);
        }
        if (elementTypeChecker_1.default.isDomElement(newAbstractElement)) {
            if (elementTypeChecker_1.default.isDomElement(oldAbtractElement)) {
                // newAbstractElement and oldAbtractElement are dom elements, but is elementNode the same
                return newAbstractElement.type === oldAbtractElement.type;
            }
            // newAbstractElement is a domElement, but oldAbtractElement isn't
            return false;
        }
        if (elementTypeChecker_1.default.isComponentElement(newAbstractElement)) {
            if (elementTypeChecker_1.default.isComponentElement(oldAbtractElement)) {
                // newAbstractElement and oldAbtractElement are components, but are they the same function
                return newAbstractElement.type === oldAbtractElement.type;
            }
            // newAbstractElement is a component, but oldAbtractElement isn't
            return false;
        }
        throw new Error('Unknown abstractElement detected');
    }
}
exports.default = new Reconciler();
//# sourceMappingURL=reconciler.js.map