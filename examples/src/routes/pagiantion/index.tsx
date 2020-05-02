import { FunctionalComponent, h } from "preact";
import Grid from "gridjs";
import faker from "faker";
import Example from "../../components/example";

const Pagination: FunctionalComponent = () => {
  const generateData = () => {
    const limit = 100;
    const data = [];
    for (let i = 0; i < limit; i++) {
      data.push([
        faker.name.firstName(),
        faker.internet.email(),
        faker.phone.phoneNumber()
      ]);
    }

    return data;
  };

  const grid = new Grid({
    data: generateData(),
    header: ["Name", "Email", "Phone Number"],
    search: {
      enabled: true
    },
    pagination: {
      limit: 5
    }
  }).createElement();

  const code = `
    const grid = new Grid({
      data: [
        ['Brandy', 'Garrick.Steuber@hotmail.com', '246-082-1548'],
        ['Myron',  'Chandler70@hotmail.com',      '218-125-8774'],
      ],
      header: ['Name', 'Email', 'Phone Number']
    }).createElement();
    `;

  return (
    <Example title="Pagination" code={code}>
      {grid}
    </Example>
  );
};

export default Pagination;
