import factory from 'instances/factory';
import elementTypeChecker from 'util/elementTypeChecker';

describe('isSameAbstractElementType()', () => {
  beforeEach(() => {
    spyOn(elementTypeChecker, 'isPlaceholderElement').and.returnValue(false);
    spyOn(elementTypeChecker, 'isTextElement').and.returnValue(false);
    spyOn(elementTypeChecker, 'isArrayElement').and.returnValue(false);
    spyOn(elementTypeChecker, 'isFragmentElement').and.returnValue(false);
    spyOn(elementTypeChecker, 'isDomElement').and.returnValue(false);
    spyOn(elementTypeChecker, 'isComponentElement').and.returnValue(false);

  });
  it('unknown element', () => {
    expect(() => {
      factory('string', 'another string' as any, () => null);
    }).toThrow(new Error('Factory couldn\'t create unknown element type'));
  });
});
