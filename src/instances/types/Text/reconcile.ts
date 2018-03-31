import TextInstance from './Instance';

export default function (newAbstractElement: string, instance: TextInstance) {
  if (newAbstractElement !== instance.props) {
    instance.setText(newAbstractElement);
    instance.props = newAbstractElement;
  }
}
