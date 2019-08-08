import TextInstance from './Instance';

export default function <HostElement, HostTextElement>(newAbstractElement: string, instance: TextInstance<HostElement, HostTextElement>) {
  if (newAbstractElement !== instance.props) {
    instance.setText(newAbstractElement);
    instance.props = newAbstractElement;
  }
}
