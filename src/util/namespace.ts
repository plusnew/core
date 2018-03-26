const svgNamespace = 'http://www.w3.org/2000/svg';

function getSpecialNamespace(elementName: string): void | string {
  if (elementName === 'svg') {
    return svgNamespace;
  }
}

export { getSpecialNamespace };
