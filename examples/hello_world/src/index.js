import './style';
import { Component } from 'preact';
import Wrapper from '../../shared/component/wrapper';
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
      <Wrapper title="Hello, World!">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            { grid }
          </div>
        </div>
      </Wrapper>
    );
  }
}
