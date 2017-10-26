import DomInstance from './Instance';
import PlusnewAbstractElement from 'PlusnewAbstractElement';

export default function (newAbstractElement: PlusnewAbstractElement, instance: DomInstance) {
  const domInstance = instance as DomInstance;
  for (const prop in newAbstractElement.props) {
    if (prop !== 'children') { // @TODO add special-values to a specific place
      domInstance.setProp(prop, newAbstractElement.props[prop]);
    }
  }

  instance.abstractElement = newAbstractElement; // updating the shadowdom
}
