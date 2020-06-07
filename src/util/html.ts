import { h, VNode } from 'preact';
import { HTMLContent } from '../view/htmlElement';

export function html(content: string, parentElement?: string): VNode {
  return h(HTMLContent, { content: content, parentElement: parentElement });
}
