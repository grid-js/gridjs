import { h, VNode } from 'preact';
import { HTMLElement } from '../view/htmlElement';

export function decode(content: string): string {
  const value = new DOMParser().parseFromString(content, 'text/html');
  return value.documentElement.textContent;
}

export function html(content: string, parentElement?: string): VNode {
  return h(HTMLElement, { content: content, parentElement: parentElement });
}
