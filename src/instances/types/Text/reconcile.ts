import TextInstance from './Instance';

export default function (newAbstractElement: string, instance: TextInstance) {
  if (newAbstractElement !== instance.abstractElement) {
    instance.setText(newAbstractElement);
    instance.abstractElement = newAbstractElement;
  }
}
