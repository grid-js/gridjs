import faker from 'faker';
import './style';
import { Component } from 'preact';
import Example from '../../shared/component/example';
import Grid from 'gridjs';

export default class App extends Component {
  generateData() {
    const limit = 100;
    const data = [];
    for (let i = 0; i < limit;i++) {
      data.push([faker.name.firstName(), faker.internet.email(), faker.phone.phoneNumber()]);
    }

    return data;
  }

  code() {
    return `
    const grid = new Grid({
      data: [
        ['Brandy', 'Garrick.Steuber@hotmail.com', '246-082-1548'],
        ['Myron',  'Chandler70@hotmail.com',      '218-125-8774'],
      ],
      header: ['Name', 'Email', 'Phone Number']
    }).createElement();
    `;
  }

  render() {
    const grid = new Grid({
      data: this.generateData(),
      header: ['Name', 'Email', 'Phone Number'],
      search: {
        enabled: true,
      },
      pagination: {
        limit: 5
      }
    }).createElement();

    return (
      <Example title="Pagination" code={this.code()}>
          { grid }
      </Example>
    );
  }
}
