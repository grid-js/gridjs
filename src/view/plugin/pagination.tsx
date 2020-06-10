import { h, Fragment } from 'preact';
import { BaseComponent, BaseProps } from '../base';
import PaginationLimit from '../../pipeline/limit/pagination';
import { className } from '../../util/className';
import Pipeline from '../../pipeline/pipeline';
import Storage from '../../storage/storage';
import ServerPaginationLimit from '../../pipeline/limit/serverPagination';
import { TCell } from '../../types';
import Tabular from '../../tabular';

interface PaginationState {
  page: number;
  limit?: number;
  total: number;
}

export interface PaginationConfig {
  enabled: boolean;
  limit?: number;
  page?: number;
  summary?: boolean;
  nextButton?: boolean;
  prevButton?: boolean;
  buttonsCount?: number;
  server?: {
    url?: (prevUrl: string, page: number, limit: number) => string;
    body?: (prevBody: BodyInit, page: number, limit: number) => BodyInit;
  };
}

interface PaginationProps extends BaseProps {
  storage: Storage<any>;
  pipeline: Pipeline<any>;
}

export class Pagination extends BaseComponent<
  PaginationProps & PaginationConfig,
  PaginationState
> {
  private processor: PaginationLimit;

  static defaultProps = {
    summary: true,
    nextButton: true,
    prevButton: true,
    buttonsCount: 3,
    limit: 10,
  };

  constructor(props) {
    super();

    this.state = {
      limit: props.limit,
      page: props.page || 0,
      total: 0,
    };
  }

  componentWillMount(): void {
    if (this.props.enabled) {
      let processor;

      if (this.props.server) {
        processor = new ServerPaginationLimit({
          limit: this.state.limit,
          page: this.state.page,
          url: this.props.server.url,
          body: this.props.server.body,
        });

        this.props.pipeline.afterProcess((result: Tabular<TCell>) => {
          this.setTotal(result.length);
        });
      } else {
        processor = new PaginationLimit({
          limit: this.state.limit,
          page: this.state.page,
        });

        // Pagination (all Limit processors) is the last step in the pipeline
        // and we assume that at this stage, we have the rows that we care about.
        // Let's grab the rows before processing Pagination and set total number of rows
        processor.beforeProcess(async (tabular: Tabular<TCell>) => {
          this.setTotal(tabular.length);
        });
      }

      this.processor = processor;
      this.props.pipeline.register(processor);
    }
  }

  componentDidMount(): void {
    this.props.pipeline.updated((processor) => {
      // this is to ensure that the current page is set to 0
      // when a processor is updated for some reason
      if (processor !== this.processor) {
        this.setPage(0);
      }
    });
  }

  private get pages(): number {
    return Math.ceil(this.state.total / this.state.limit);
  }

  private setPage(page: number): void {
    if (page >= this.pages || page < 0 || page === this.state.page) {
      return null;
    }

    this.setState({
      page: page,
    });

    this.processor.setProps({
      page: page,
    });
  }

  private setTotal(totalRows: number): void {
    // to set the correct total number of rows
    // when running in-memory operations
    this.setState({
      total: totalRows,
    });
  }

  render() {
    if (!this.props.enabled) return null;

    // how many pagination buttons to render?
    const maxCount: number = Math.min(this.pages, this.props.buttonsCount);

    let pagePivot = Math.min(this.state.page, Math.floor(maxCount / 2));
    if (this.state.page + Math.floor(maxCount / 2) >= this.pages) {
      pagePivot = maxCount - (this.pages - this.state.page);
    }

    return (
      <div className={className('pagination')}>
        {this.props.summary && this.state.total > 0 && (
          <div
            className={className('summary')}
            title={`Page ${this.state.page + 1} of ${this.pages}`}
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

        <div className={className('pages')}>
          {this.props.prevButton && (
            <button onClick={this.setPage.bind(this, this.state.page - 1)}>
              Previous
            </button>
          )}

          {this.pages > maxCount && this.state.page - pagePivot > 0 && (
            <Fragment>
              <button onClick={this.setPage.bind(this, 0)} title={`Page 1`}>
                1
              </button>
              <button className={className('spread')}>...</button>
            </Fragment>
          )}

          {Array.from(Array(maxCount).keys())
            .map((i) => this.state.page + (i - pagePivot))
            .map((i) => (
              <button
                onClick={this.setPage.bind(this, i)}
                className={
                  this.state.page === i ? className('currentPage') : null
                }
                title={`Page ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}

          {this.pages > maxCount &&
            this.pages > this.state.page + pagePivot + 1 && (
              <Fragment>
                <button className={className('spread')}>...</button>
                <button
                  onClick={this.setPage.bind(this, this.pages - 1)}
                  title={`Page ${this.pages}`}
                >
                  {this.pages}
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
