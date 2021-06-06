import './style';
import { Grid } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { useEffect, useRef } from 'preact/hooks';

export default function App() {
  const ref = useRef();

  useEffect(() => {
    window.grid = new Grid({
      columns: ['a', 'b', 'c'],
      data: [
        [1, 2, 3],
        [4, 5, 6],
      ],
    });
  });

  return (
    <div id="wrapper">
      <h1>Hello, World!</h1>
      <div id="container" ref={ref} />
    </div>
  );
}
