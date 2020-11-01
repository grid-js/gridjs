import { h, VNode } from 'preact';
import { HTMLElement } from '../view/htmlElement';

export function html(content: string, parentElement?: string): VNode {
  return h(HTMLElement, { content: content, parentElement: parentElement });
}
