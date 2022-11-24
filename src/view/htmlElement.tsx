import { h } from 'preact';

export function HTMLElement(props: {
  content: string;
  parentElement?: string;
}) {
  return h(props.parentElement || 'span', {
    dangerouslySetInnerHTML: { __html: props.content },
  });
}
