// eslint-disable-next-line
/// <reference types="enzyme-adapter-preact-pure"/>
import 'enzyme-adapter-preact-pure';

import { JSDOM } from 'jsdom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-preact-pure';

// Setup JSDOM
const dom = new JSDOM('', {
  // Enable `requestAnimationFrame` which Preact uses internally.
  pretendToBeVisual: true,
});

// eslint-disable-next-line
// @ts-ignore
global.Event = dom.window.Event;

// eslint-disable-next-line
// @ts-ignore
global.Node = dom.window.Node;

// eslint-disable-next-line
// @ts-ignore
global.Element = dom.window.Element;

// eslint-disable-next-line
// @ts-ignore
global.HTMLElement = dom.window.HTMLElement;

// eslint-disable-next-line
// @ts-ignore
global.window = dom.window;

// eslint-disable-next-line
// @ts-ignore
global.document = dom.window.document;

// eslint-disable-next-line
// @ts-ignore
global.requestAnimationFrame = dom.window.requestAnimationFrame;

// Setup Enzyme
configure({ adapter: new Adapter() });
