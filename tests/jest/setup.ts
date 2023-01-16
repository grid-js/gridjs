// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="enzyme-adapter-preact-pure"/>

import { JSDOM } from 'jsdom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

const jsdom = new JSDOM('', {
  url: 'http://localhost/',
  // Enable `requestAnimationFrame` which Preact uses internally.
  pretendToBeVisual: true,
});
const { window } = jsdom;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.Node = window.Node;
global.Event = window.Event;
global.Element = window.Element;
global.HTMLElement = window.HTMLElement;

global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
copyProps(window, global);

// Setup Enzyme
configure({ adapter: new Adapter() });
