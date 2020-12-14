import { h, Fragment } from 'preact';
import PaginationLimit from '../../../pipeline/limit/pagination';
import { className } from '../../../util/className';
import ServerPaginationLimit from '../../../pipeline/limit/serverPagination';
import Tabular from '../../../tabular';
import { PipelineProcessor } from '../../../pipeline/processor';
import { PluginBaseComponent, PluginBaseProps } from '../../../plugin';
import { PaginationType } from './paginationType';

interface PaginationState {
  page: number;
  limit?: number;
  total?: number;
  hasNextPage?: boolean;
}

export interface PaginationConfig {
  enabled: boolean;
  limit?: number;
  page?: number;
  summary?: boolean;
  nextButton?: boolean;
  prevButton?: boolean;
  buttonsCount?: number;
  resetPageOnUpdate?: boolean;
  type: PaginationType;
  server?: {
    url?: (prevUrl: string, page: number, limit: number) => string;
    body?: (prevBody: BodyInit, page: number, limit: number) => BodyInit;
  };
}

export class Pagination extends PluginBaseComponent<PluginBaseProps<Pagination> & PaginationConfig, PaginationState> {
  private processor: PaginationLimit | ServerPaginationLimit;
  private onUpdateFn: (processor: PipelineProcessor<any, any>) => void;
  private setTotalFromTabularFn: (tabular: Tabular) => void;

  static defaultProps = {
    summary: true,
    nextButton: true,
    prevButton: true,
    buttonsCount: 3,
    limit: 10,
    resetPageOnUpdate: true,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      limit: props.limit,
      page: props.page || 0,
      total: 0,
      hasNextPage: false,
    };
  }

  componentWillMount(): void {
    if (this.props.enabled) {
      let processor;

      this.setTotalFromTabularFn = this.setTotalFromTabular.bind(this);

      if (this.props.server) {
        processor = new ServerPaginationLimit({
          limit: this.state.limit,
          page: this.state.page,
          url: this.props.server.url,
          body: this.props.server.body,
        });

        this.config.pipeline.on('afterProcess', this.setTotalFromTabularFn);
      } else {
        processor = new PaginationLimit({
          limit: this.state.limit,
          page: this.state.page,
        });

        // Pagination (all Limit processors) is the last step in the pipeline
        // and we assume that at this stage, we have the rows that we care about.
        // Let's grab the rows before processing Pagination and set total number of rows
        processor.on('beforeProcess', this.setTotalFromTabularFn);
      }

      this.processor = processor;
      this.config.pipeline.register(processor);

      // we need to make sure that the state is set
      // to the default props when an error happens
      this.config.pipeline.on('error', () => {
        console.error("An error ocurred.");
        this.setState({
          total: 0,
          page: 0,
          hasNextPage: false
        });
      });
    }
  }

  private setTotalFromTabular(tabular: Tabular): void {
    this.updateTotal(tabular.length, tabular.hasNextPage);
  }

  private onUpdate(processor): void {
    // this is to ensure that the current page is set to 0
    // when a processor is updated for some reason
    if (this.props.resetPageOnUpdate && processor !== this.processor) {
      this.setPage(0);
    }
  }

  componentDidMount(): void {
    this.onUpdateFn = this.onUpdate.bind(this);
    this.config.pipeline.on('updated', this.onUpdateFn);
  }

  componentWillUnmount() {
    this.config.pipeline.unregister(this.processor);
    this.config.pipeline.off('updated', this.onUpdateFn);
  }

  private get pages(): number {
    return Math.ceil(this.state.total / this.state.limit);
  }

  private setPage(page: number): void {
    if(this.props.type == 'offset-based') {
      if (page >= this.pages || page < 0 || page === this.state.page) {
        return null;
      }
    }

    this.setState({
      page: page,
    });

    this.processor.setProps({
      page: page,
    });
  }

  private updateTotal(totalRows: number, hasNextPage: boolean): void {
    this.setState({
      total: totalRows,
      hasNextPage: hasNextPage
    });
  }

  renderPages() {
    if (this.props.buttonsCount <= 0 || this.props.type == 'opaque-based') return null;

    // how many pagination buttons to render?
    const maxCount: number = Math.min(this.pages, this.props.buttonsCount);

    let pagePivot = Math.min(this.state.page, Math.floor(maxCount / 2));
    if (this.state.page + Math.floor(maxCount / 2) >= this.pages) {
      pagePivot = maxCount - (this.pages - this.state.page);
    }

    return (
      <Fragment>
        {this.pages > maxCount && this.state.page - pagePivot > 0 && (
          <Fragment>
            <button
              tabIndex={0}
              onClick={this.setPage.bind(this, 0)}
              title={this._('pagination.firstPage')}
            >
              {this._('1')}
            </button>
            <button tabIndex={-1} className={className('spread')}>
              ...
            </button>
          </Fragment>
        )}

        {Array.from(Array(maxCount).keys())
          .map((i) => this.state.page + (i - pagePivot))
          .map((i) => (
            <button
              tabIndex={0}
              onClick={this.setPage.bind(this, i)}
              className={
                this.state.page === i ? className('currentPage') : null
              }
              title={this._('pagination.page', i + 1)}
            >
              {this._(`${i + 1}`)}
            </button>
          ))}

        {this.pages > maxCount && this.pages > this.state.page + pagePivot + 1 && (
          <Fragment>
            <button tabIndex={-1} className={className('spread')}>
              ...
            </button>
            <button
              tabIndex={0}
              onClick={this.setPage.bind(this, this.pages - 1)}
              title={this._('pagination.page', this.pages)}
            >
              {this._(`${this.pages}`)}
            </button>
          </Fragment>
        )}
      </Fragment>
    );
  }

  renderSummary() {
    if(this.props.type == 'opaque-based') return null;

    return (
      <Fragment>
        {this.props.summary && this.state.total > 0 && (
          <div
            role="status"
            className={className('summary')}
            title={this._(
              'pagination.navigate',
              this.state.page + 1,
              this.pages,
            )}>
            {this._('pagination.showing')}{' '}
            <b>{this._(`${this.state.page * this.state.limit + 1}`)}</b>{' '}
            {this._('pagination.to')}{' '}
            <b>
              {this._(
                `${Math.min(
                  (this.state.page + 1) * this.state.limit,
                  this.state.total,
                )}`,
              )}
            </b>{' '}
            {this._('pagination.of')} <b>{this._(`${this.state.total}`)}</b>{' '}
            {this._('pagination.results')}
          </div>
        )}
      </Fragment>
    );
  }

  render() {
    if (!this.props.enabled) return null;

    return (
      <div className={className('pagination')}>
        {this.renderSummary()}

        <div className={className('pages')}>
          {this.props.prevButton && (
            <button
              tabIndex={0}
              disabled={this.state.page === 0}
              onClick={this.setPage.bind(this, this.state.page - 1)}>
              {this._('pagination.previous')}
            </button>
          )}

          {this.renderPages()}

          {this.props.nextButton && (
            <button
              tabIndex={0}
              disabled={this.props.type == 'offset-based' ? (this.pages === this.state.page + 1 || this.pages === 0) : (this.state.hasNextPage === false)}
              onClick={this.setPage.bind(this, this.state.page + 1)}>
              {this._('pagination.next')}
            </button>
          )}
        </div>
      </div>
    );
  }
}
