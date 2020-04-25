import { h } from 'preact';
import { BaseComponent, BaseProps } from '../base';
import Config from '../../config';
import PaginationLimit from '../../pipeline/limit/pagination';
import className from '../../util/className';

import '../../theme/mermaid/pagination.scss';

interface PaginationState {
  page: number;
  enabled: boolean;
  limit?: number;
  total: number;
  pages: number;
}

export interface PaginationConfig {
  limit?: number;
  page?: number;
  enabled?: boolean;
  summary?: boolean;
  nextButton?: boolean;
  prevButton?: boolean;
  buttonsCount?: number;
}

export class Pagination extends BaseComponent<
  BaseProps & PaginationConfig,
  PaginationState
> {
  private processor: PaginationLimit;

  static defaultProps = {
    summary: true,
    nextButton: true,
    prevButton: true,
    buttonsCount: 3,
  };

  constructor(props) {
    super();

    let enabled = false;
    if (props.enabled !== undefined) {
      enabled = props.enabled;
    } else {
      enabled = !isNaN(Number(props.limit));
    }

    this.state = {
      enabled: enabled,
      limit: props.limit,
      page: props.page || 0,
      total: 0,
      pages: 0,
    };
  }

  componentWillMount(): void {
    if (this.state.enabled) {
      const processor = new PaginationLimit({
        limit: this.state.limit,
        page: this.state.page,
      });

      processor.beforeProcess(tabular => {
        const totalRows = tabular.rows.length;

        this.setState({
          total: totalRows,
          pages: Math.ceil(totalRows / this.state.limit),
        });
      });

      this.processor = processor;

      Config.current.pipeline.register(processor);
    }
  }

  private setPage(page: number): void {
    this.setState({
      page: page,
    });

    this.processor.setProps({
      page: page,
    });
  }

  render() {
    if (!this.state.enabled) return null;

    // how many pagination buttons to render?
    const maxCount: number = Math.min(
      Math.floor(this.state.pages / 2),
      this.props.buttonsCount,
    );

    return (
      <div className={className(Config.current.classNamePrefix, 'pagination')}>
        {this.props.summary && (
          <div
            className={className(Config.current.classNamePrefix, 'summary')}
            title={`Page ${this.state.page + 1} of ${this.state.pages}`}
          >
            Showing <span>{this.state.page * this.state.limit + 1}</span> to{' '}
            <span>
              {Math.min(
                (this.state.page + 1) * this.state.limit,
                this.state.total,
              )}
            </span>{' '}
            of <span>{this.state.total}</span> results
          </div>
        )}

        <div className={className(Config.current.classNamePrefix, 'pages')}>
          {Array.from(Array(maxCount).keys()).map(i => (
            <button onClick={this.setPage.bind(this, i)}>{i + 1}</button>
          ))}
          {this.state.pages > 1 && this.state.pages > maxCount * 2 && (
            <span>...</span>
          )}
          {Array.from(Array(maxCount).keys())
            .map(i => this.state.pages - (maxCount - i))
            .map(i => (
              <button onClick={this.setPage.bind(this, i)} title={`Page ${i}`}>
                {i + 1}
              </button>
            ))}
        </div>
      </div>
    );
  }
}
