import './style';
import { Component } from 'preact';
import Grid from '@usablica/gridjs';

export default class App extends Component {
  componentDidMount() {
    new Grid({
      data: [
        [1, 2, 3],
        ['a', 'b', 'b'],
        ["hello", "world", "!"]
      ],
      header: ['h1', 'h2', 'h3']
    }).render(document.getElementById('container'));
  }

  render() {
    return (
			<div>
        <h1>Hello, World!</h1>
        <div id="container"/>
      </div>
    );
  }
}
