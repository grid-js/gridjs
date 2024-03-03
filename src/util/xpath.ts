export const xPath = function(node, optimized) {
  if (node.nodeType === 9) {
    return '/';
  }

  const steps = [];

  while (node) {
    const step = xPathValue(node, optimized);
    if (!step) {
      break;
    }  // Error - bail out early.
    steps.push(step);
    if (step.optimized) {
      break;
    }
    node = node.parentNode;
  }

  steps.reverse();
  return (steps.length && steps[0].optimized ? '' : '/') + steps.join('/');
};

const xPathValue = function(node, optimized) {
  let ownValue;
  const ownIndex = xPathIndex(node);
  if (ownIndex === -1) {
    return null;
  }  // Error.

  switch (node.nodeType) {
    case 1:
      if (optimized && node.getAttribute('id')) {
        return new Step('//*[@id="' + node.getAttribute('id') + '"]', true);
      }
      ownValue = node.localName;
      break;
    case 2:
      ownValue = '@' + node.nodeName;
      break;
    case 3:
    case 4:
      ownValue = 'text()';
      break;
    case 7:
      ownValue = 'processing-instruction()';
      break;
    case 8:
      ownValue = 'comment()';
      break;
    case 9:
      ownValue = '';
      break;
    default:
      ownValue = '';
      break;
  }

  if (ownIndex > 0) {
    ownValue += '[' + ownIndex + ']';
  }

  return new Step(ownValue, node.nodeType === 9);
};

const xPathIndex = function(node) {
  /**
   * Returns -1 in case of error, 0 if no siblings matching the same expression,
   * <XPath index among the same expression-matching sibling nodes> otherwise.
   */
  function areNodesSimilar(left, right) {
    if (left === right) {
      return true;
    }

    if (left.nodeType === 1 && right.nodeType === 1) {
      return left.localName === right.localName;
    }

    if (left.nodeType === right.nodeType) {
      return true;
    }

    // XPath treats CDATA as text nodes.
    const leftType = left.nodeType === 4 ? 3 : left.nodeType;
    const rightType = right.nodeType === 4 ? 3 : right.nodeType;
    return leftType === rightType;
  }

  const siblings = node.parentNode ? node.parentNode.children : null;
  if (!siblings) {
    return 0;
  }  // Root node - no siblings.
  let hasSameNamedElements;
  for (let i = 0; i < siblings.length; ++i) {
    if (areNodesSimilar(node, siblings[i]) && siblings[i] !== node) {
      hasSameNamedElements = true;
      break;
    }
  }
  if (!hasSameNamedElements) {
    return 0;
  }
  let ownIndex = 1;  // XPath indices start with 1.
  for (let i = 0; i < siblings.length; ++i) {
    if (areNodesSimilar(node, siblings[i])) {
      if (siblings[i] === node) {
        return ownIndex;
      }
      ++ownIndex;
    }
  }
  return -1;  // An error occurred: |node| not found in parent's children.
};

export class Step {
  value: string;
  optimized: boolean;
  constructor(value: string, optimized: boolean) {
    this.value = value;
    this.optimized = optimized || false;
  }

  toString(): string {
    return this.value;
  }
}
