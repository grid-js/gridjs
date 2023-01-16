import { h } from 'preact';

export interface HTMLContentProps {
  content: string;
  parentElement?: string;
}

export function HTMLElement(props: HTMLContentProps) {
  return h(props.parentElement || 'span', {
    dangerouslySetInnerHTML: { __html: props.content },
  });
}
