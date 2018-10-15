import ComponentInstance from '../instances/types/Component/Instance';
import PlusnewAbstractElement from '../PlusnewAbstractElement';

// @FIXME this is needed to trick typescript into generating .d.ts file
// if a file doesn't export anything other than types, it won't generate the .d.ts file
const nothing = null;
export { nothing };

export type ApplicationElement =
  | PlusnewAbstractElement
  | string
  | number
  | boolean
  | null
  | undefined
  | (PlusnewAbstractElement | string | number | boolean | null | undefined)[];

export type props = {
  [key: string]: unknown;
  key?: number | string;
  children: ApplicationElement[];
};

/**
 * thats how a application component should look like
 */
export default interface Component<componentProps extends Partial<props> = {} > {
  (props: componentProps, componentInstance: ComponentInstance<componentProps>): ApplicationElement;
}
