import { h } from 'preact';
import { mount } from 'enzyme';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Config, ConfigContext } from '../../../src/config';
import { Container } from '../../../src/view/container';
import {
  PipelineProcessor,
  ProcessorType,
} from '../../../src/pipeline/processor';
import { flushPromises } from '../testUtil';
import { Status } from '../../../src/types';
import * as TableActions from '../../../src/view/actions';
import Tabular from '../../../src/tabular';
import { EventEmitter } from '../../../src/util/eventEmitter';

expect.extend(toHaveNoViolations);

describe('Container component', () => {
  let config: Config;

  beforeEach(() => {
    config = new Config().update({
      processingThrottleMs: 0,
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a container with table', async () => {
    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();
    await flushPromises();

    expect(container.html()).toMatchSnapshot();
    expect(config.store.getState().status).toBe(Status.Rendered);
  });

  it('should attach styles', async () => {
    config.update({
      width: '500px',
      search: true,
      pagination: true,
      style: {
        container: {
          border: '1px solid #ccc',
        },
        header: {
          padding: '5px',
        },
        footer: {
          margin: '2px',
        },
        td: {
          'font-weight': 'bold',
        },
        th: {
          border: '2px solid red',
        },
        table: {
          'font-size': '15px',
        },
      },
    });

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();

    expect(container.html()).toMatchSnapshot();
  });

  it('should attach classNames', async () => {
    config.update({
      width: '500px',
      search: true,
      pagination: true,
      columns: [
        {
          name: 'c1',
          sort: false,
        },
        {
          name: 'c2',
          sort: true,
        },
        {
          name: 'c3',
          sort: true,
        },
      ],
      className: {
        container: 'test-container',
        header: 'test-header',
        footer: 'test-footer',
        td: 'test-td',
        th: 'test-th',
        table: 'test-table',
        thead: 'test-head',
        tbody: 'test-tbody',
        sort: 'test-sort',
      },
    });

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();

    expect(container.html()).toMatchSnapshot();
  });

  it('should render a container with searchable table', async () => {
    config.update({
      search: true,
    });

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();

    expect(container.html()).toMatchSnapshot();
  });

  it('should render a container with sortable and paginated table', async () => {
    config.update({
      search: true,
      pagination: {
        limit: 5,
      },
      columns: [
        {
          name: 'c1',
          sort: false,
        },
        {
          name: 'c2',
          sort: true,
        },
        {
          name: 'c3',
          sort: true,
        },
      ],
    });

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();

    expect(container.html()).toMatchSnapshot();
  });

  it('should render a container with error', async () => {
    console.error = jest.fn();

    class ErrorProcessor extends PipelineProcessor<string, any> {
      get type(): ProcessorType {
        return ProcessorType.Limit;
      }
      _process(): string {
        throw Error('something happened');
      }
    }

    config.className = {
      error: 'my-error',
    };
    config.pipeline.register(new ErrorProcessor());

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();

    expect(container.html()).toMatchSnapshot();
  });

  it('should not violate accessibility test', async () => {
    config.update({
      pagination: {
        limit: 1,
      },
      search: true,
      sort: true,
    });

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    container.update();

    await flushPromises();

    expect(await axe(container.html())).toHaveNoViolations();
  });

  it('should render a container with null array', async () => {
    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();

    config.store.dispatch(TableActions.SetData(Tabular.fromArray([])));
    config.store.dispatch(TableActions.SetStatusToRendered());

    await flushPromises();

    expect(container.html()).toMatchSnapshot();
  });

  it('should render a container with array of objects without columns input', async () => {
    const config = Config.fromPartialConfig({
      processingThrottleMs: 0,
      data: [
        [1, 2, 3],
        ['a', 'b', 'c'],
      ],
    }) as Config;

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();

    expect(container.html()).toMatchSnapshot();
  });

  it('should render a container with array of objects with string columns', async () => {
    const config = Config.fromPartialConfig({
      processingThrottleMs: 0,
      columns: ['Name', 'Phone Number'],
      data: [
        { name: 'boo', phoneNumber: '123' },
        { name: 'foo', phoneNumber: '456' },
        { name: 'bar', phoneNumber: '789' },
      ],
    });

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();
    await flushPromises();

    expect(container.html()).toMatchSnapshot();
  });

  it('should render a container with array of objects with object columns', async () => {
    const config = Config.fromPartialConfig({
      processingThrottleMs: 0,
      columns: [
        {
          name: 'Name',
          id: 'name',
        },
        {
          name: 'Phone Number',
          id: 'phone',
        },
      ],
      data: [
        { name: 'boo', phone: '123' },
        { name: 'foo', phone: '456' },
        { name: 'bar', phone: '789' },
      ],
    });

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();
    await flushPromises();

    expect(container.html()).toMatchSnapshot();
  });

  it('should remove the EventEmitter listeners', async () => {
    const config = new Config().update({
      data: [],
      search: true,
      pagination: true,
      columns: ['Name', 'Phone Number'],
      sort: true,
      eventEmitter: new EventEmitter<any>(),
    });

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();

    container.unmount();

    await flushPromises();
    expect(Object.values(config.eventEmitter.listeners)).toHaveLength(0);
    expect(Object.values(config.store.getListeners())).toHaveLength(0);
  });

  it('should unregister the processors', async () => {
    const config = new Config().update({
      processingThrottleMs: 0,
      pagination: true,
      search: true,
      sort: true,
      columns: [
        {
          name: 'Name',
          id: 'name',
        },
        {
          name: 'Phone Number',
          id: 'phone',
        },
      ],
      data: [
        { name: 'boo', phone: '123' },
        { name: 'foo', phone: '456' },
        { name: 'bar', phone: '789' },
      ],
    });

    const mockRegister = jest.fn();
    const mockUnregister = jest.fn();

    config.pipeline.register = mockRegister;
    config.pipeline.unregister = mockUnregister;

    const container = mount(
      <ConfigContext.Provider value={config}>
        <Container />
      </ConfigContext.Provider>,
    );

    await flushPromises();

    container.unmount();

    await flushPromises();
    await flushPromises();
    await flushPromises();
    await flushPromises();

    expect(mockUnregister.mock.calls.length).toBe(
      mockRegister.mock.calls.length,
    );
  });
});
