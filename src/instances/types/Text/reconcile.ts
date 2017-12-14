import TextInstance from './Instance';

export default function (newAbstractElement: string, instance: TextInstance) {
  instance.setText(newAbstractElement);
  instance.abstractElement = newAbstractElement;
}
