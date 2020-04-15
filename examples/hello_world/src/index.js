import './style';
import { Component } from 'preact';
import Grid from 'gridjs';

export default class App extends Component {
  render() {
    const grid = new Grid({
      data: [
        [1, 2, 3],
        ['a', 'b', 'b'],
        ["hello", "world", "!"]
      ],
      header: ['h1', 'h2', 'h3']
    }).createElement();

    return (
			<div>
        <h1>Hello, World!</h1>
        <div id="container">
          { grid }
        </div>
      </div>
    );
  }
}
