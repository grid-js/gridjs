import faker from 'faker';
import './style';
import { Component } from 'preact';
import Wrapper from '../../shared/component/wrapper';
import Grid from 'gridjs';

export default class App extends Component {
  generateData() {
    const limit = 10;
    const data = [];
    for (let i = 0; i < limit;i++) {
      data.push([faker.name.firstName(), faker.internet.email(), faker.phone.phoneNumber()]);
    }

    return data;
  }

  render() {
    const grid = new Grid({
      data: this.generateData(),
      header: ['Name', 'Email', 'Phone Number']
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
