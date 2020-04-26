import { h, Fragment } from 'preact';
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

  componentDidMount(): void {
    Config.current.pipeline.updated(processor => {
      // this is to ensure that the current page is set to 0
      // when a processor is updated for some reason
      if (processor !== this.processor) {
        this.setPage(0);
      }
    });
  }

  private setPage(page: number): void {
    if (page >= this.state.pages || page < 0 || page === this.state.page) {
      return null;
    }

    this.setState({
      page: page,
    });

    this.processor.setProps({
      page: page,
    });
  }

  private currentPageClass(page: number): string | null {
    if (this.state.page === page) {
      return className(Config.current.classNamePrefix, 'currentPage');
    }

    return null;
  }

  render() {
    if (!this.state.enabled) return null;

    // how many pagination buttons to render?
    const maxCount: number = Math.min(
      this.state.pages,
      this.props.buttonsCount,
    );

    let pagePivot = Math.min(this.state.page, Math.floor(maxCount / 2));
    if (this.state.page + Math.floor(maxCount / 2) >= this.state.pages) {
      pagePivot = maxCount - (this.state.pages - this.state.page);
    }

    return (
      <div className={className(Config.current.classNamePrefix, 'pagination')}>
        {this.props.summary && this.state.total > 0 && (
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
          {this.props.prevButton && (
            <button onClick={this.setPage.bind(this, this.state.page - 1)}>
              Previous
            </button>
          )}

          {this.state.pages > maxCount && this.state.page - pagePivot > 0 && (
            <Fragment>
              <button onClick={this.setPage.bind(this, 0)} title={`Page 1`}>
                1
              </button>
              <button
                className={className(Config.current.classNamePrefix, 'spread')}
              >
                ...
              </button>
            </Fragment>
          )}

          {Array.from(Array(maxCount).keys())
            .map(i => this.state.page + (i - pagePivot))
            .map(i => (
              <button
                onClick={this.setPage.bind(this, i)}
                className={this.currentPageClass(i)}
              >
                {i + 1}
              </button>
            ))}

          {this.state.pages > maxCount &&
            this.state.pages > this.state.page + pagePivot + 1 && (
              <Fragment>
                <button
                  className={className(
                    Config.current.classNamePrefix,
                    'spread',
                  )}
                >
                  ...
                </button>
                <button
                  onClick={this.setPage.bind(this, this.state.pages - 1)}
                  title={`Page ${this.state.pages}`}
                >
                  {this.state.pages}
                </button>
              </Fragment>
            )}

          {this.props.nextButton && (
            <button onClick={this.setPage.bind(this, this.state.page + 1)}>
              Next
            </button>
          )}
        </div>
      </div>
    );
  }
}
